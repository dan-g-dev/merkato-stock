import React, { useEffect, useState } from "react";
import { Package, Wallet, TrendingUp, ShoppingCart, AlertTriangle, Users, Truck, Ban } from "lucide-react";
import { api } from "../../../services/api";
import { formatEtb } from "../../../utils/format";
import { LoadingSpinner, ErrorState } from "../ui/Ui";
import { SimpleBarChart, SimpleLineChart } from "../ui/Charts";

interface Metrics {
  totalProducts: number;
  totalInventoryValue: number;
  todaySales: number;
  monthlySales: number;
  totalPurchases: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalCustomers: number;
  totalSuppliers: number;
}

interface Charts {
  salesByDay: { date: string; total: number }[];
  purchasesByMonth: { month: string; total: number }[];
  topSellingProducts: { name: string; units: number }[];
  inventoryByCategory: { name: string; value: number }[];
}

const KpiCard: React.FC<{ icon: React.ElementType; label: string; value: string; tone: string }> = ({ icon: Icon, label, value, tone }) => (
  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">{label}</span>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tone}`}>
        <Icon className="w-4 h-4" />
      </div>
    </div>
    <p className="text-xl font-black">{value}</p>
  </div>
);

export const OverviewPage: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [charts, setCharts] = useState<Charts | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/dashboard/metrics")
      .then((res) => {
        setMetrics(res.metrics);
        setCharts(res.charts);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!metrics || !charts) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={Package} label="Total Products" value={String(metrics.totalProducts)} tone="bg-blue-100 text-blue-600 dark:bg-blue-900/40" />
        <KpiCard icon={Wallet} label="Inventory Value" value={formatEtb(metrics.totalInventoryValue)} tone="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40" />
        <KpiCard icon={TrendingUp} label="Today's Sales" value={formatEtb(metrics.todaySales)} tone="bg-red-100 text-red-600 dark:bg-red-900/40" />
        <KpiCard icon={TrendingUp} label="Monthly Sales" value={formatEtb(metrics.monthlySales)} tone="bg-red-100 text-red-600 dark:bg-red-900/40" />
        <KpiCard icon={ShoppingCart} label="Total Purchases" value={formatEtb(metrics.totalPurchases)} tone="bg-purple-100 text-purple-600 dark:bg-purple-900/40" />
        <KpiCard icon={AlertTriangle} label="Low Stock Products" value={String(metrics.lowStockProducts)} tone="bg-amber-100 text-amber-600 dark:bg-amber-900/40" />
        <KpiCard icon={Users} label="Total Customers" value={String(metrics.totalCustomers)} tone="bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40" />
        <KpiCard icon={Truck} label="Total Suppliers" value={String(metrics.totalSuppliers)} tone="bg-zinc-100 text-zinc-600 dark:bg-zinc-800" />
      </div>

      {metrics.outOfStockProducts > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-300 text-xs font-bold px-4 py-3">
          <Ban className="w-4 h-4" /> {metrics.outOfStockProducts} product(s) are completely out of stock.
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <h3 className="text-sm font-black mb-3">Sales Over Time (last 14 days)</h3>
          <SimpleLineChart data={charts.salesByDay.map((d) => ({ label: d.date.slice(5), value: d.total }))} />
        </div>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <h3 className="text-sm font-black mb-3">Purchase Overview (last 6 months)</h3>
          <SimpleBarChart
            data={charts.purchasesByMonth.map((d) => ({ label: d.month.slice(5), value: d.total }))}
            valueFormatter={(v) => formatEtb(v)}
            color="#8b5cf6"
          />
        </div>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <h3 className="text-sm font-black mb-3">Top-Selling Products</h3>
          {charts.topSellingProducts.length === 0 ? (
            <p className="text-xs text-zinc-400 py-8 text-center">No sales recorded yet.</p>
          ) : (
            <SimpleBarChart data={charts.topSellingProducts.map((p) => ({ label: p.name, value: p.units }))} color="#10b981" />
          )}
        </div>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <h3 className="text-sm font-black mb-3">Inventory Value by Category</h3>
          <SimpleBarChart
            data={charts.inventoryByCategory.map((c) => ({ label: c.name, value: c.value }))}
            valueFormatter={(v) => formatEtb(v)}
            color="#3b82f6"
          />
        </div>
      </div>
    </div>
  );
};
