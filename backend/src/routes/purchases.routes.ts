import { Router } from "express";
import { db, insertRow, updateRow, nowIso } from "../models/store";
import { pool } from "../config/db";
import { requireAuth, requireRole } from "../middleware/auth";
import { logActivity } from "../utils/activityLog";
import { checkLowStock } from "../utils/lowStock";

export const purchasesRouter = Router();
purchasesRouter.use(requireAuth);

function nextPoNumber(): string {
  const year = new Date().getFullYear();
  const countThisYear = db.purchaseOrders.filter((po) => po.purchase_order_number.includes(String(year))).length;
  return `PO-${year}-${String(countThisYear + 1).padStart(4, "0")}`;
}

function withItems(po: (typeof db.purchaseOrders)[number]) {
  return { ...po, items: db.purchaseItems.filter((i) => i.purchase_order_id === po.id) };
}

// GET /api/purchases?status=&supplierId=&page=&pageSize=
purchasesRouter.get("/", (req, res) => {
  const { status, supplierId, page = "1", pageSize = "10" } = req.query as Record<string, string>;
  let results = db.purchaseOrders;
  if (status) results = results.filter((po) => po.status === status);
  if (supplierId) results = results.filter((po) => po.supplier_id === Number(supplierId));
  results = [...results].sort((a, b) => b.id - a.id);

  const pageNum = Math.max(1, Number(page) || 1);
  const size = Math.max(1, Number(pageSize) || 10);
  const start = (pageNum - 1) * size;

  res.json({
    success: true,
    purchaseOrders: results.slice(start, start + size).map(withItems),
    pagination: { page: pageNum, pageSize: size, total: results.length, totalPages: Math.ceil(results.length / size) || 1 },
  });
});

// GET /api/purchases/:id
purchasesRouter.get("/:id", (req, res) => {
  const po = db.purchaseOrders.find((p) => p.id === Number(req.params.id));
  if (!po) return res.status(404).json({ success: false, message: "Purchase order not found." });
  res.json({ success: true, purchaseOrder: withItems(po) });
});

// POST /api/purchases
// Body: { supplierId, notes, items: [{ productId, quantity, unitCost }], submit: boolean }
purchasesRouter.post("/", requireRole("ADMIN", "MANAGER"), async (req, res) => {
  const { supplierId, notes, items, submit } = req.body || {};

  const supplier = db.suppliers.find((s) => s.id === Number(supplierId));
  if (!supplier) return res.status(400).json({ success: false, message: "Choose a valid supplier." });
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "Add at least one product to the purchase order." });
  }

  for (const item of items) {
    if (!db.products.some((p) => p.id === Number(item.productId))) {
      return res.status(400).json({ success: false, message: `Unknown product in purchase order (id ${item.productId}).` });
    }
    if (!item.quantity || Number(item.quantity) <= 0) {
      return res.status(400).json({ success: false, message: "Every line item needs a quantity greater than zero." });
    }
  }

  const total = items.reduce((sum: number, item: any) => sum + Number(item.quantity) * Number(item.unitCost), 0);
  const now = nowIso();
  const poRow = {
    purchase_order_number: nextPoNumber(),
    supplier_id: supplier.id,
    status: (submit ? "PENDING" : "DRAFT") as const,
    total,
    notes: notes || null,
    created_by: req.user!.id,
    created_at: now,
    updated_at: now,
  };
  const poId = await insertRow("purchase_orders", poRow);
  const po = { id: poId, ...poRow };
  db.purchaseOrders.push(po);

  for (const item of items) {
    const itemRow = {
      purchase_order_id: po.id,
      product_id: Number(item.productId),
      quantity: Number(item.quantity),
      unit_cost: Number(item.unitCost),
      total: Number(item.quantity) * Number(item.unitCost),
    };
    const itemId = await insertRow("purchase_items", itemRow);
    db.purchaseItems.push({ id: itemId, ...itemRow });
  }

  await logActivity({
    userId: req.user!.id,
    action: "CREATED_PURCHASE_ORDER",
    entityType: "purchase_order",
    entityId: po.id,
    description: `${req.user!.name} created ${po.purchase_order_number} (${po.status}) for ${supplier.company_name}`,
  });

  res.status(201).json({ success: true, purchaseOrder: withItems(po) });
});

// POST /api/purchases/:id/receive - marks a PO received and increases inventory.
// Uses a real MySQL transaction: every item's stock update and its
// inventory_transaction row are committed together, or none are.
purchasesRouter.post("/:id/receive", requireRole("ADMIN", "MANAGER"), async (req, res) => {
  const po = db.purchaseOrders.find((p) => p.id === Number(req.params.id));
  if (!po) return res.status(404).json({ success: false, message: "Purchase order not found." });
  if (po.status === "RECEIVED") return res.status(409).json({ success: false, message: "This purchase order was already received." });
  if (po.status === "CANCELLED") return res.status(409).json({ success: false, message: "This purchase order was cancelled." });

  const items = db.purchaseItems.filter((i) => i.purchase_order_id === po.id);
  const conn = await pool.getConnection();

  // In-memory changes only get applied after the DB transaction commits
  // successfully, so a failure never leaves the cache and the database
  // pointing at different numbers.
  const applyToCache: Array<() => void> = [];

  try {
    await conn.beginTransaction();

    for (const item of items) {
      const product = db.products.find((p) => p.id === item.product_id);
      if (!product) throw new Error(`Product ${item.product_id} no longer exists.`);

      const previousQuantity = product.current_stock;
      const newQuantity = previousQuantity + item.quantity;
      const updatedAt = nowIso();

      await conn.query("UPDATE products SET current_stock = ?, updated_at = ? WHERE id = ?", [newQuantity, updatedAt, product.id]);

      const txRow = {
        product_id: product.id,
        type: "PURCHASE",
        quantity: item.quantity,
        previous_quantity: previousQuantity,
        new_quantity: newQuantity,
        reference_type: "PURCHASE_ORDER",
        reference_id: po.id,
        performed_by: req.user!.id,
        notes: `Received ${po.purchase_order_number}`,
        created_at: nowIso(),
      };
      const [txResult]: any = await conn.query(
        "INSERT INTO inventory_transactions (product_id, type, quantity, previous_quantity, new_quantity, reference_type, reference_id, performed_by, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [txRow.product_id, txRow.type, txRow.quantity, txRow.previous_quantity, txRow.new_quantity, txRow.reference_type, txRow.reference_id, txRow.performed_by, txRow.notes, txRow.created_at]
      );

      applyToCache.push(() => {
        product.current_stock = newQuantity;
        product.updated_at = updatedAt;
        db.inventoryTransactions.push({ id: txResult.insertId, ...txRow } as any);
      });
    }

    const updatedAt = nowIso();
    await conn.query("UPDATE purchase_orders SET status = ?, updated_at = ? WHERE id = ?", ["RECEIVED", updatedAt, po.id]);

    await conn.commit();

    for (const apply of applyToCache) apply();
    po.status = "RECEIVED";
    po.updated_at = updatedAt;

    for (const item of items) {
      const product = db.products.find((p) => p.id === item.product_id)!;
      await checkLowStock(product);
    }
  } catch (err) {
    await conn.rollback();
    return res.status(500).json({ success: false, message: "Could not receive this purchase order. No changes were made." });
  } finally {
    conn.release();
  }

  await logActivity({
    userId: req.user!.id,
    action: "RECEIVED_PURCHASE_ORDER",
    entityType: "purchase_order",
    entityId: po.id,
    description: `${req.user!.name} received ${po.purchase_order_number} - inventory updated`,
  });

  res.json({ success: true, purchaseOrder: withItems(po) });
});

// PUT /api/purchases/:id - edit a DRAFT purchase order, or cancel one
purchasesRouter.put("/:id", requireRole("ADMIN", "MANAGER"), async (req, res) => {
  const po = db.purchaseOrders.find((p) => p.id === Number(req.params.id));
  if (!po) return res.status(404).json({ success: false, message: "Purchase order not found." });
  if (po.status === "RECEIVED") return res.status(409).json({ success: false, message: "A received purchase order can't be edited." });

  const { notes, status } = req.body || {};
  const changes: Record<string, any> = {};
  if (notes !== undefined) { po.notes = notes; changes.notes = notes; }
  if (status === "CANCELLED" || status === "PENDING" || status === "DRAFT") { po.status = status; changes.status = status; }
  po.updated_at = nowIso();
  changes.updated_at = po.updated_at;
  await updateRow("purchase_orders", po.id, changes);

  await logActivity({ userId: req.user!.id, action: "UPDATED_PURCHASE_ORDER", entityType: "purchase_order", entityId: po.id, description: `${req.user!.name} updated ${po.purchase_order_number}` });
  res.json({ success: true, purchaseOrder: withItems(po) });
});
