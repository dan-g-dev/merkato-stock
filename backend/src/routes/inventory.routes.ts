import { Router } from "express";
import { db, nextId, nowIso } from "../models/store";
import { requireAuth, requireRole } from "../middleware/auth";
import { logActivity } from "../utils/activityLog";
import { checkLowStock } from "../utils/lowStock";
import { toCsv } from "../utils/csv";

export const inventoryRouter = Router();
inventoryRouter.use(requireAuth);

// GET /api/inventory - all products with their stock status (used by the Inventory page)
inventoryRouter.get("/", (_req, res) => {
  const items = db.products.map((p) => ({
    ...p,
    stockStatus: p.current_stock <= 0 ? "OUT_OF_STOCK" : p.current_stock <= p.minimum_stock ? "LOW_STOCK" : "IN_STOCK",
  }));
  res.json({ success: true, items });
});

// GET /api/inventory/transactions?productId=
inventoryRouter.get("/transactions", (req, res) => {
  const { productId } = req.query as Record<string, string>;
  let transactions = db.inventoryTransactions;
  if (productId) transactions = transactions.filter((t) => t.product_id === Number(productId));
  const sorted = [...transactions].sort((a, b) => b.id - a.id);
  res.json({ success: true, transactions: sorted });
});

// GET /api/inventory/transactions/export.csv
inventoryRouter.get("/transactions/export.csv", (_req, res) => {
  const rows = db.inventoryTransactions.map((t) => {
    const product = db.products.find((p) => p.id === t.product_id);
    return { ...t, productName: product?.name || `#${t.product_id}` };
  });
  const csv = toCsv(rows, [
    { key: "created_at", header: "Date" },
    { key: "productName", header: "Product" },
    { key: "type", header: "Type" },
    { key: "quantity", header: "Quantity" },
    { key: "previous_quantity", header: "Previous Stock" },
    { key: "new_quantity", header: "New Stock" },
    { key: "notes", header: "Notes" },
  ]);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=inventory-transactions.csv");
  res.send(csv);
});

// GET /api/inventory/:productId - a single product's stock + its transaction history
inventoryRouter.get("/:productId", (req, res) => {
  const product = db.products.find((p) => p.id === Number(req.params.productId));
  if (!product) return res.status(404).json({ success: false, message: "Product not found." });
  const transactions = db.inventoryTransactions.filter((t) => t.product_id === product.id).sort((a, b) => b.id - a.id);
  res.json({ success: true, product, transactions });
});

// POST /api/inventory/adjust - manual stock adjustment (ADJUSTMENT_IN / ADJUSTMENT_OUT)
inventoryRouter.post("/adjust", requireRole("ADMIN", "MANAGER"), (req, res) => {
  const { productId, direction, quantity, notes } = req.body || {};
  const product = db.products.find((p) => p.id === Number(productId));
  if (!product) return res.status(404).json({ success: false, message: "Product not found." });

  const qty = Number(quantity);
  if (!qty || qty <= 0) return res.status(400).json({ success: false, message: "Quantity must be a positive number." });
  if (direction !== "IN" && direction !== "OUT") {
    return res.status(400).json({ success: false, message: "Direction must be IN or OUT." });
  }
  if (direction === "OUT" && qty > product.current_stock) {
    return res.status(400).json({ success: false, message: "Insufficient stock." });
  }

  const previousQuantity = product.current_stock;
  product.current_stock = direction === "IN" ? previousQuantity + qty : previousQuantity - qty;
  product.updated_at = nowIso();

  db.inventoryTransactions.push({
    id: nextId("inventoryTransactions"),
    product_id: product.id,
    type: direction === "IN" ? "ADJUSTMENT_IN" : "ADJUSTMENT_OUT",
    quantity: qty,
    previous_quantity: previousQuantity,
    new_quantity: product.current_stock,
    reference_type: "MANUAL",
    reference_id: null,
    performed_by: req.user!.id,
    notes: notes || null,
    created_at: nowIso(),
  });

  checkLowStock(product);
  logActivity({
    userId: req.user!.id,
    action: "ADJUSTED_STOCK",
    entityType: "product",
    entityId: product.id,
    description: `${req.user!.name} adjusted stock for "${product.name}" (${direction === "IN" ? "+" : "-"}${qty})`,
  });

  res.json({ success: true, product });
});
