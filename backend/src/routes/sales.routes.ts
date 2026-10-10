import { Router } from "express";
import { db, nowIso } from "../models/store";
import { pool } from "../config/db";
import { requireAuth } from "../middleware/auth";
import { logActivity } from "../utils/activityLog";
import { checkLowStock } from "../utils/lowStock";
import { toCsv } from "../utils/csv";

export const salesRouter = Router();
salesRouter.use(requireAuth);

function nextInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const countThisYear = db.sales.filter((s) => s.invoice_number.includes(String(year))).length;
  return `INV-${year}-${String(countThisYear + 1).padStart(4, "0")}`;
}

function withItems(sale: (typeof db.sales)[number]) {
  return { ...sale, items: db.saleItems.filter((i) => i.sale_id === sale.id) };
}

// GET /api/sales?employeeId=&customerId=&from=&to=&page=&pageSize=
salesRouter.get("/", (req, res) => {
  const { employeeId, customerId, from, to, page = "1", pageSize = "10" } = req.query as Record<string, string>;

  // EMPLOYEE role only sees their own sales (spec: "View own sales").
  let results = db.sales;
  if (req.user!.role === "EMPLOYEE") results = results.filter((s) => s.employee_id === req.user!.id);
  if (employeeId) results = results.filter((s) => s.employee_id === Number(employeeId));
  if (customerId) results = results.filter((s) => s.customer_id === Number(customerId));
  if (from) results = results.filter((s) => s.created_at >= from);
  if (to) results = results.filter((s) => s.created_at <= to);
  results = [...results].sort((a, b) => b.id - a.id);

  const pageNum = Math.max(1, Number(page) || 1);
  const size = Math.max(1, Number(pageSize) || 10);
  const start = (pageNum - 1) * size;

  res.json({
    success: true,
    sales: results.slice(start, start + size).map(withItems),
    pagination: { page: pageNum, pageSize: size, total: results.length, totalPages: Math.ceil(results.length / size) || 1 },
  });
});

// GET /api/sales/export.csv
salesRouter.get("/export.csv", (req, res) => {
  let results = db.sales;
  if (req.user!.role === "EMPLOYEE") results = results.filter((s) => s.employee_id === req.user!.id);

  const rows = results.map((s) => {
    const customer = db.customers.find((c) => c.id === s.customer_id);
    const employee = db.users.find((u) => u.id === s.employee_id);
    return { ...s, customerName: customer?.name || "Walk-in", employeeName: employee?.name || "-" };
  });
  const csv = toCsv(rows, [
    { key: "invoice_number", header: "Invoice" },
    { key: "created_at", header: "Date" },
    { key: "customerName", header: "Customer" },
    { key: "employeeName", header: "Sold By" },
    { key: "subtotal", header: "Subtotal (ETB)" },
    { key: "discount", header: "Discount (ETB)" },
    { key: "total", header: "Total (ETB)" },
    { key: "payment_method", header: "Payment Method" },
    { key: "payment_status", header: "Payment Status" },
  ]);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=sales.csv");
  res.send(csv);
});

// GET /api/sales/:id
salesRouter.get("/:id", (req, res) => {
  const sale = db.sales.find((s) => s.id === Number(req.params.id));
  if (!sale) return res.status(404).json({ success: false, message: "Sale not found." });
  if (req.user!.role === "EMPLOYEE" && sale.employee_id !== req.user!.id) {
    return res.status(403).json({ success: false, message: "You can only view your own sales." });
  }
  res.json({ success: true, sale: withItems(sale) });
});

// POST /api/sales
// Body: { customerId?, items: [{ productId, quantity }], discount?, paymentMethod }
// This is the spec's core "atomic sale" flow: check stock -> create sale ->
// create sale items -> decrease stock -> create inventory transactions.
// If ANY line fails stock validation, nothing is written at all — and now
// that writes are real, "nothing written" is enforced with a real MySQL
// transaction, not just in-memory bookkeeping.
salesRouter.post("/", requireAuth, async (req, res) => {
  const { customerId, items, discount = 0, paymentMethod = "CASH" } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "Add at least one product to the sale." });
  }

  // Step 1: validate every line BEFORE writing anything.
  const resolvedItems: Array<{ product: (typeof db.products)[number]; quantity: number }> = [];
  for (const item of items) {
    const product = db.products.find((p) => p.id === Number(item.productId));
    if (!product) return res.status(400).json({ success: false, message: `Unknown product (id ${item.productId}).` });

    const quantity = Number(item.quantity);
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: `Enter a valid quantity for ${product.name}.` });
    }
    if (quantity > product.current_stock) {
      return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}. Only ${product.current_stock} ${product.unit} left.` });
    }
    resolvedItems.push({ product, quantity });
  }

  const subtotal = resolvedItems.reduce((sum, i) => sum + i.quantity * i.product.selling_price, 0);
  const discountAmount = Number(discount) || 0;
  const total = Math.max(0, subtotal - discountAmount);
  const now = nowIso();

  // Step 2: everything below only runs once every line has passed
  // validation, and all of it commits (or rolls back) together.
  const conn = await pool.getConnection();
  let sale: (typeof db.sales)[number];
  const newSaleItems: (typeof db.saleItems)[number][] = [];
  const newTransactions: (typeof db.inventoryTransactions)[number][] = [];
  const stockUpdates: Array<{ product: (typeof db.products)[number]; newStock: number }> = [];

  try {
    await conn.beginTransaction();

    const saleRow = {
      invoice_number: nextInvoiceNumber(),
      customer_id: customerId ? Number(customerId) : null,
      employee_id: req.user!.id,
      subtotal,
      discount: discountAmount,
      tax: 0,
      total,
      payment_method: paymentMethod,
      payment_status: "PAID",
      created_at: now,
    };
    const [saleResult]: any = await conn.query(
      "INSERT INTO sales (invoice_number, customer_id, employee_id, subtotal, discount, tax, total, payment_method, payment_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [saleRow.invoice_number, saleRow.customer_id, saleRow.employee_id, saleRow.subtotal, saleRow.discount, saleRow.tax, saleRow.total, saleRow.payment_method, saleRow.payment_status, saleRow.created_at]
    );
    sale = { id: saleResult.insertId, ...saleRow } as any;

    for (const { product, quantity } of resolvedItems) {
      const itemRow = { sale_id: sale.id, product_id: product.id, quantity, unit_price: product.selling_price, unit_cost: product.cost_price, total: quantity * product.selling_price };
      const [itemResult]: any = await conn.query(
        "INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, unit_cost, total) VALUES (?, ?, ?, ?, ?, ?)",
        [itemRow.sale_id, itemRow.product_id, itemRow.quantity, itemRow.unit_price, itemRow.unit_cost, itemRow.total]
      );
      newSaleItems.push({ id: itemResult.insertId, ...itemRow });

      const previousQuantity = product.current_stock;
      const newQuantity = previousQuantity - quantity;
      await conn.query("UPDATE products SET current_stock = ?, updated_at = ? WHERE id = ?", [newQuantity, now, product.id]);
      stockUpdates.push({ product, newStock: newQuantity });

      const txRow = {
        product_id: product.id,
        type: "SALE",
        quantity,
        previous_quantity: previousQuantity,
        new_quantity: newQuantity,
        reference_type: "SALE",
        reference_id: sale.id,
        performed_by: req.user!.id,
        notes: `Sold on ${sale.invoice_number}`,
        created_at: now,
      };
      const [txResult]: any = await conn.query(
        "INSERT INTO inventory_transactions (product_id, type, quantity, previous_quantity, new_quantity, reference_type, reference_id, performed_by, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [txRow.product_id, txRow.type, txRow.quantity, txRow.previous_quantity, txRow.new_quantity, txRow.reference_type, txRow.reference_id, txRow.performed_by, txRow.notes, txRow.created_at]
      );
      newTransactions.push({ id: txResult.insertId, ...txRow } as any);
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    return res.status(500).json({ success: false, message: "Could not complete this sale. No changes were made." });
  } finally {
    conn.release();
  }

  // Only now that the transaction has actually committed do we update the
  // in-memory cache, so it can never drift ahead of what's really saved.
  db.sales.push(sale);
  for (const item of newSaleItems) db.saleItems.push(item);
  for (const tx of newTransactions) db.inventoryTransactions.push(tx);
  for (const { product, newStock } of stockUpdates) {
    product.current_stock = newStock;
    product.updated_at = now;
    await checkLowStock(product);
  }

  await logActivity({
    userId: req.user!.id,
    action: "COMPLETED_SALE",
    entityType: "sale",
    entityId: sale.id,
    description: `${req.user!.name} completed sale ${sale.invoice_number} for ${sale.total.toLocaleString()} ETB`,
  });

  res.status(201).json({ success: true, sale: withItems(sale) });
});
