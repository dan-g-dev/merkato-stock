import { Router } from "express";
import { db } from "../models/store";
import { requireAuth } from "../middleware/auth";

export const dashboardRouter = Router();
dashboardRouter.use(requireAuth);

function isSameDay(isoDate: string, reference: Date) {
  const d = new Date(isoDate);
  return d.toDateString() === reference.toDateString();
}

function isSameMonth(isoDate: string, reference: Date) {
  const d = new Date(isoDate);
  return d.getFullYear() === reference.getFullYear() && d.getMonth() === reference.getMonth();
}

// GET /api/dashboard/metrics - the numbers shown on the Overview page.
// Every figure here is computed live from the in-memory tables, never hardcoded.
dashboardRouter.get("/metrics", (_req, res) => {
  const now = new Date();

  const totalProducts = db.products.length;
  const totalInventoryValue = db.products.reduce((sum, p) => sum + p.current_stock * p.cost_price, 0);

  const todaySales = db.sales.filter((s) => isSameDay(s.created_at, now)).reduce((sum, s) => sum + s.total, 0);
  const monthlySales = db.sales.filter((s) => isSameMonth(s.created_at, now)).reduce((sum, s) => sum + s.total, 0);
  const totalPurchases = db.purchaseOrders.filter((po) => po.status === "RECEIVED").reduce((sum, po) => sum + po.total, 0);

  const lowStockProducts = db.products.filter((p) => p.current_stock > 0 && p.current_stock <= p.minimum_stock).length;
  const outOfStockProducts = db.products.filter((p) => p.current_stock <= 0).length;

  // Sales over the last 14 days, for the trend chart.
  const salesByDay: { date: string; total: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    const dayKey = day.toISOString().slice(0, 10);
    const total = db.sales.filter((s) => s.created_at.slice(0, 10) === dayKey).reduce((sum, s) => sum + s.total, 0);
    salesByDay.push({ date: dayKey, total });
  }

  // Purchases over the last 6 months, for the purchase overview chart.
  const purchasesByMonth: { month: string; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = monthDate.toISOString().slice(0, 7);
    const total = db.purchaseOrders
      .filter((po) => po.status === "RECEIVED" && po.created_at.slice(0, 7) === monthKey)
      .reduce((sum, po) => sum + po.total, 0);
    purchasesByMonth.push({ month: monthKey, total });
  }

  // Top-selling products by units sold.
  const unitsByProduct = new Map<number, number>();
  for (const item of db.saleItems) {
    unitsByProduct.set(item.product_id, (unitsByProduct.get(item.product_id) || 0) + item.quantity);
  }
  const topSellingProducts = [...unitsByProduct.entries()]
    .map(([productId, units]) => ({ name: db.products.find((p) => p.id === productId)?.name || `#${productId}`, units }))
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  // Inventory value by category.
  const valueByCategory = new Map<string, number>();
  for (const product of db.products) {
    const categoryName = db.categories.find((c) => c.id === product.category_id)?.name || "Uncategorized";
    valueByCategory.set(categoryName, (valueByCategory.get(categoryName) || 0) + product.current_stock * product.cost_price);
  }

  res.json({
    success: true,
    metrics: {
      totalProducts,
      totalInventoryValue,
      todaySales,
      monthlySales,
      totalPurchases,
      lowStockProducts,
      outOfStockProducts,
      totalCustomers: db.customers.length,
      totalSuppliers: db.suppliers.length,
    },
    charts: {
      salesByDay,
      purchasesByMonth,
      topSellingProducts,
      inventoryByCategory: [...valueByCategory.entries()].map(([name, value]) => ({ name, value })),
    },
  });
});
