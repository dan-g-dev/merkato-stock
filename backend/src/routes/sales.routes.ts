import { Router } from "express";
import { db, nextId, nowIso } from "../models/store";
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
// If ANY line fails stock validation, nothing is written at all.
salesRouter.post("/", requireAuth, (req, res) => {
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

  // Step 2: everything below only runs once every line has passed validation.
  const now = nowIso();
  const sale = {
    id: nextId("sales"),
    invoice_number: nextInvoiceNumber(),
    customer_id: customerId ? Number(customerId) : null,
    employee_id: req.user!.id,
    subtotal,
    discount: discountAmount,
    tax: 0,
    total,
    payment_method: paymentMethod,
    payment_status: "PAID" as const,
    created_at: now,
  };
  db.sales.push(sale);

  for (const { product, quantity } of resolvedItems) {
    db.saleItems.push({
      id: nextId("saleItems"),
      sale_id: sale.id,
      product_id: product.id,
      quantity,
      unit_price: product.selling_price,
      unit_cost: product.cost_price,
      total: quantity * product.selling_price,
    });

    const previousQuantity = product.current_stock;
    product.current_stock -= quantity;
    product.updated_at = now;

    db.inventoryTransactions.push({
      id: nextId("inventoryTransactions"),
      product_id: product.id,
      type: "SALE",
      quantity,
      previous_quantity: previousQuantity,
      new_quantity: product.current_stock,
      reference_type: "SALE",
      reference_id: sale.id,
      performed_by: req.user!.id,
      notes: `Sold on ${sale.invoice_number}`,
      created_at: now,
    });

    checkLowStock(product);
  }

  logActivity({
    userId: req.user!.id,
    action: "COMPLETED_SALE",
    entityType: "sale",
    entityId: sale.id,
    description: `${req.user!.name} completed sale ${sale.invoice_number} for ${sale.total.toLocaleString()} ETB`,
  });

  res.status(201).json({ success: true, sale: withItems(sale) });
});
