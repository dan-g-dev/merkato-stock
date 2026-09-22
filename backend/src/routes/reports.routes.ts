import { Router } from "express";
import { db } from "../models/store";
import { requireAuth } from "../middleware/auth";
import { toCsv } from "../utils/csv";

export const reportsRouter = Router();
reportsRouter.use(requireAuth);

function inRange(dateStr: string, from?: string, to?: string) {
  if (from && dateStr < from) return false;
  if (to && dateStr > to) return false;
  return true;
}

// GET /api/reports/sales?from=&to=&employeeId=
reportsRouter.get("/sales", (req, res) => {
  const { from, to, employeeId } = req.query as Record<string, string>;
  let sales = db.sales.filter((s) => inRange(s.created_at, from, to));
  if (employeeId) sales = sales.filter((s) => s.employee_id === Number(employeeId));

  const grossSales = sales.reduce((sum, s) => sum + s.total, 0);
  const totalDiscount = sales.reduce((sum, s) => sum + s.discount, 0);

  res.json({
    success: true,
    summary: { orderCount: sales.length, grossSales, totalDiscount },
    sales: [...sales].sort((a, b) => b.id - a.id),
  });
});

// GET /api/reports/purchases?from=&to=&supplierId=
reportsRouter.get("/purchases", (req, res) => {
  const { from, to, supplierId } = req.query as Record<string, string>;
  let purchaseOrders = db.purchaseOrders.filter((po) => inRange(po.created_at, from, to));
  if (supplierId) purchaseOrders = purchaseOrders.filter((po) => po.supplier_id === Number(supplierId));

  const totalSpent = purchaseOrders.filter((po) => po.status === "RECEIVED").reduce((sum, po) => sum + po.total, 0);

  res.json({
    success: true,
    summary: { orderCount: purchaseOrders.length, totalSpent },
    purchaseOrders: [...purchaseOrders].sort((a, b) => b.id - a.id),
  });
});

// GET /api/reports/inventory?categoryId=
reportsRouter.get("/inventory", (req, res) => {
  const { categoryId } = req.query as Record<string, string>;
  let products = db.products;
  if (categoryId) products = products.filter((p) => p.category_id === Number(categoryId));

  const totalValue = products.reduce((sum, p) => sum + p.current_stock * p.cost_price, 0);
  const lowStockCount = products.filter((p) => p.current_stock > 0 && p.current_stock <= p.minimum_stock).length;
  const outOfStockCount = products.filter((p) => p.current_stock <= 0).length;

  res.json({
    success: true,
    summary: { productCount: products.length, totalValue, lowStockCount, outOfStockCount },
    products,
  });
});

// GET /api/reports/low-stock
reportsRouter.get("/low-stock", (_req, res) => {
  const products = db.products.filter((p) => p.current_stock <= p.minimum_stock);
  res.json({ success: true, products });
});

// GET /api/reports/profit?from=&to=
// profit = selling_price - cost_price, applied per sale line item, per spec section 19.
reportsRouter.get("/profit", (req, res) => {
  const { from, to } = req.query as Record<string, string>;
  const sales = db.sales.filter((s) => inRange(s.created_at, from, to));
  const saleIds = new Set(sales.map((s) => s.id));
  const lineItems = db.saleItems.filter((i) => saleIds.has(i.sale_id));

  const grossSales = lineItems.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
  const costOfGoods = lineItems.reduce((sum, i) => sum + i.quantity * i.unit_cost, 0);
  const grossProfit = grossSales - costOfGoods;

  // Per-product breakdown, most profitable first.
  const byProduct = new Map<number, { productId: number; name: string; unitsSold: number; revenue: number; cost: number; profit: number }>();
  for (const item of lineItems) {
    const product = db.products.find((p) => p.id === item.product_id);
    const key = item.product_id;
    const existing = byProduct.get(key) || { productId: key, name: product?.name || `#${key}`, unitsSold: 0, revenue: 0, cost: 0, profit: 0 };
    existing.unitsSold += item.quantity;
    existing.revenue += item.quantity * item.unit_price;
    existing.cost += item.quantity * item.unit_cost;
    existing.profit = existing.revenue - existing.cost;
    byProduct.set(key, existing);
  }

  res.json({
    success: true,
    summary: { grossSales, costOfGoods, grossProfit },
    byProduct: [...byProduct.values()].sort((a, b) => b.profit - a.profit),
  });
});

// GET /api/reports/employee-sales?from=&to=
reportsRouter.get("/employee-sales", (req, res) => {
  const { from, to } = req.query as Record<string, string>;
  const sales = db.sales.filter((s) => inRange(s.created_at, from, to));

  const byEmployee = new Map<number, { employeeId: number; name: string; orderCount: number; total: number }>();
  for (const sale of sales) {
    const employee = db.users.find((u) => u.id === sale.employee_id);
    const existing = byEmployee.get(sale.employee_id) || { employeeId: sale.employee_id, name: employee?.name || `#${sale.employee_id}`, orderCount: 0, total: 0 };
    existing.orderCount += 1;
    existing.total += sale.total;
    byEmployee.set(sale.employee_id, existing);
  }

  res.json({ success: true, employees: [...byEmployee.values()].sort((a, b) => b.total - a.total) });
});

// GET /api/reports/:type/export.csv - quick CSV export for any report above
reportsRouter.get("/:type/export.csv", (req, res) => {
  const { type } = req.params;
  let rows: Record<string, unknown>[] = [];
  let columns: { key: string; header: string }[] = [];

  if (type === "sales") {
    rows = db.sales;
    columns = [
      { key: "invoice_number", header: "Invoice" },
      { key: "created_at", header: "Date" },
      { key: "subtotal", header: "Subtotal" },
      { key: "discount", header: "Discount" },
      { key: "total", header: "Total" },
    ];
  } else if (type === "purchases") {
    rows = db.purchaseOrders;
    columns = [
      { key: "purchase_order_number", header: "PO Number" },
      { key: "status", header: "Status" },
      { key: "total", header: "Total" },
      { key: "created_at", header: "Date" },
    ];
  } else if (type === "inventory") {
    rows = db.products;
    columns = [
      { key: "sku", header: "SKU" },
      { key: "name", header: "Product" },
      { key: "current_stock", header: "Stock" },
      { key: "minimum_stock", header: "Minimum" },
    ];
  } else {
    return res.status(400).json({ success: false, message: "Unknown report type." });
  }

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=${type}-report.csv`);
  res.send(toCsv(rows, columns));
});
