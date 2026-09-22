import { Router } from "express";
import { db, nextId, nowIso } from "../models/store";
import { requireAuth, requireRole } from "../middleware/auth";
import { logActivity } from "../utils/activityLog";
import { checkLowStock } from "../utils/lowStock";
import { toCsv } from "../utils/csv";

export const productsRouter = Router();
productsRouter.use(requireAuth);

function withStockStatus(product: (typeof db.products)[number]) {
  const stockStatus = product.current_stock <= 0 ? "OUT_OF_STOCK" : product.current_stock <= product.minimum_stock ? "LOW_STOCK" : "IN_STOCK";
  return { ...product, stockStatus };
}

// GET /api/products?search=&category=&stockFilter=&status=&sort=&page=&pageSize=
productsRouter.get("/", (req, res) => {
  const { search = "", category, stockFilter, status, sort = "name_asc", page = "1", pageSize = "10" } = req.query as Record<string, string>;

  let results = db.products.map(withStockStatus);

  if (search) {
    const term = search.toLowerCase();
    results = results.filter(
      (p) => p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term) || (p.barcode || "").toLowerCase().includes(term)
    );
  }
  if (category) results = results.filter((p) => p.category_id === Number(category));
  if (stockFilter) results = results.filter((p) => p.stockStatus === stockFilter);
  if (status) results = results.filter((p) => p.status === status);

  const [sortField, sortDirection] = sort.split("_");
  results.sort((a, b) => {
    const aVal = (a as any)[sortField === "price" ? "selling_price" : sortField] ?? (a as any).name;
    const bVal = (b as any)[sortField === "price" ? "selling_price" : sortField] ?? (b as any).name;
    const comparison = typeof aVal === "string" ? aVal.localeCompare(bVal) : aVal - bVal;
    return sortDirection === "desc" ? -comparison : comparison;
  });

  const pageNum = Math.max(1, Number(page) || 1);
  const size = Math.max(1, Number(pageSize) || 10);
  const start = (pageNum - 1) * size;
  const pageItems = results.slice(start, start + size);

  res.json({
    success: true,
    products: pageItems,
    pagination: { page: pageNum, pageSize: size, total: results.length, totalPages: Math.ceil(results.length / size) || 1 },
  });
});

// GET /api/products/export.csv - exports the currently filtered set
productsRouter.get("/export.csv", (req, res) => {
  const { search = "" } = req.query as Record<string, string>;
  let results = db.products;
  if (search) {
    const term = search.toLowerCase();
    results = results.filter((p) => p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term));
  }
  const csv = toCsv(results as any, [
    { key: "sku", header: "SKU" },
    { key: "name", header: "Product Name" },
    { key: "barcode", header: "Barcode" },
    { key: "cost_price", header: "Cost Price (ETB)" },
    { key: "selling_price", header: "Selling Price (ETB)" },
    { key: "current_stock", header: "Current Stock" },
    { key: "minimum_stock", header: "Minimum Stock" },
    { key: "unit", header: "Unit" },
    { key: "status", header: "Status" },
  ]);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=products.csv");
  res.send(csv);
});

// GET /api/products/:id
productsRouter.get("/:id", (req, res) => {
  const product = db.products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ success: false, message: "Product not found." });
  res.json({ success: true, product: withStockStatus(product) });
});

// POST /api/products
productsRouter.post("/", requireRole("ADMIN", "MANAGER"), (req, res) => {
  const { sku, barcode, name, description, category_id, supplier_id, cost_price, selling_price, current_stock, minimum_stock, unit } = req.body || {};

  if (!sku || !name) return res.status(400).json({ success: false, message: "SKU and product name are required." });
  if (db.products.some((p) => p.sku.toLowerCase() === String(sku).toLowerCase())) {
    return res.status(409).json({ success: false, message: "A product with that SKU already exists." });
  }
  if (barcode && db.products.some((p) => p.barcode && p.barcode.toLowerCase() === String(barcode).toLowerCase())) {
    return res.status(409).json({ success: false, message: "A product with that barcode already exists." });
  }
  if (Number(cost_price) < 0 || Number(selling_price) < 0) {
    return res.status(400).json({ success: false, message: "Prices can't be negative." });
  }

  const now = nowIso();
  const product = {
    id: nextId("products"),
    sku: String(sku),
    barcode: barcode || null,
    name: String(name),
    description: description || null,
    category_id: category_id ? Number(category_id) : null,
    supplier_id: supplier_id ? Number(supplier_id) : null,
    cost_price: Number(cost_price) || 0,
    selling_price: Number(selling_price) || 0,
    current_stock: Number(current_stock) || 0,
    minimum_stock: Number(minimum_stock) || 0,
    unit: unit || "pcs",
    image: null,
    status: "ACTIVE" as const,
    created_at: now,
    updated_at: now,
  };
  db.products.push(product);
  checkLowStock(product);
  logActivity({ userId: req.user!.id, action: "CREATED_PRODUCT", entityType: "product", entityId: product.id, description: `${req.user!.name} added product "${product.name}"` });
  res.status(201).json({ success: true, product });
});

// PUT /api/products/:id
productsRouter.put("/:id", requireRole("ADMIN", "MANAGER"), (req, res) => {
  const product = db.products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ success: false, message: "Product not found." });

  const { sku, barcode } = req.body || {};
  if (sku && db.products.some((p) => p.id !== product.id && p.sku.toLowerCase() === String(sku).toLowerCase())) {
    return res.status(409).json({ success: false, message: "A product with that SKU already exists." });
  }
  if (barcode && db.products.some((p) => p.id !== product.id && p.barcode && p.barcode.toLowerCase() === String(barcode).toLowerCase())) {
    return res.status(409).json({ success: false, message: "A product with that barcode already exists." });
  }

  Object.assign(product, req.body || {}, { id: product.id, updated_at: nowIso() });
  checkLowStock(product);
  logActivity({ userId: req.user!.id, action: "UPDATED_PRODUCT", entityType: "product", entityId: product.id, description: `${req.user!.name} updated product "${product.name}"` });
  res.json({ success: true, product });
});

// DELETE /api/products/:id
productsRouter.delete("/:id", requireRole("ADMIN", "MANAGER"), (req, res) => {
  const index = db.products.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: "Product not found." });

  const [removed] = db.products.splice(index, 1);
  logActivity({ userId: req.user!.id, action: "DELETED_PRODUCT", entityType: "product", entityId: removed.id, description: `${req.user!.name} deleted product "${removed.name}"` });
  res.json({ success: true });
});
