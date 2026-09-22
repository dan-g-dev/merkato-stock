import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { api, downloadCsv } from "../../../services/api";
import { formatEtb, formatDate } from "../../../utils/format";
import { LoadingSpinner, ErrorState, purchaseStatusBadge } from "../ui/Ui";

type ReportTab = "sales" | "purchases" | "inventory" | "profit" | "low-stock" | "employee-sales";

const TABS: { key: ReportTab; label: string }[] = [
  { key: "sales", label: "Sales Report" },
  { key: "purchases", label: "Purchase Report" },
  { key: "inventory", label: "Inventory Report" },
  { key: "profit", label: "Profit Report" },
  { key: "low-stock", label: "Low Stock Report" },
  { key: "employee-sales", label: "Employee Sales" },
];

export const ReportsPage: React.FC = () => {
  const [tab, setTab] = useState<ReportTab>("sales");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    api
      .get(`/reports/${tab}?${params.toString()}`)
      .then((res) => { setData(res); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [tab, from, to]);

  const handleExport = async () => {
    if (!["sales", "purchases", "inventory"].includes(tab)) return;
    const csv = await api.get<string>(`/reports/${tab}/export.csv`);
    downloadCsv(csv, `${tab}-report.csv`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${tab === t.key ? "bg-[#E42528] text-white border-[#E42528]" : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-2 justify-between">
        <div className="flex items-end gap-2">
          <div>
            <label className="block text-[11px] font-bold mb-1">From</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900" />
          </div>
          <div>
            <label className="block text-[11px] font-bold mb-1">To</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900" />
          </div>
        </div>
        {["sales", "purchases", "inventory"].includes(tab) && (
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
        {isLoading ? <LoadingSpinner /> : error ? <ErrorState message={error} /> : (
          <>
            {tab === "sales" && data && (
              <>
                <SummaryRow items={[["Orders", data.summary.orderCount], ["Gross Sales", formatEtb(data.summary.grossSales)], ["Total Discount", formatEtb(data.summary.totalDiscount)]]} />
                <SimpleTable
                  rows={data.sales}
                  columns={[
                    { key: "invoice_number", header: "Invoice" },
                    { key: "created_at", header: "Date", render: (v: string) => formatDate(v) },
                    { key: "subtotal", header: "Subtotal", render: (v: number) => formatEtb(v) },
                    { key: "total", header: "Total", render: (v: number) => formatEtb(v) },
                  ]}
                />
              </>
            )}

            {tab === "purchases" && data && (
              <>
                <SummaryRow items={[["Orders", data.summary.orderCount], ["Total Spent (Received)", formatEtb(data.summary.totalSpent)]]} />
                <SimpleTable
                  rows={data.purchaseOrders}
                  columns={[
                    { key: "purchase_order_number", header: "PO Number" },
                    { key: "status", header: "Status", render: (v: string) => purchaseStatusBadge(v) },
                    { key: "total", header: "Total", render: (v: number) => formatEtb(v) },
                    { key: "created_at", header: "Date", render: (v: string) => formatDate(v) },
                  ]}
                />
              </>
            )}

            {tab === "inventory" && data && (
              <>
                <SummaryRow items={[["Products", data.summary.productCount], ["Total Value", formatEtb(data.summary.totalValue)], ["Low Stock", data.summary.lowStockCount], ["Out of Stock", data.summary.outOfStockCount]]} />
                <SimpleTable
                  rows={data.products}
                  columns={[
                    { key: "name", header: "Product" },
                    { key: "current_stock", header: "Stock" },
                    { key: "minimum_stock", header: "Minimum" },
                    { key: "cost_price", header: "Cost", render: (v: number) => formatEtb(v) },
                  ]}
                />
              </>
            )}

            {tab === "profit" && data && (
              <>
                <SummaryRow items={[["Gross Sales", formatEtb(data.summary.grossSales)], ["Cost of Goods", formatEtb(data.summary.costOfGoods)], ["Gross Profit", formatEtb(data.summary.grossProfit)]]} />
                <SimpleTable
                  rows={data.byProduct}
                  columns={[
                    { key: "name", header: "Product" },
                    { key: "unitsSold", header: "Units Sold" },
                    { key: "revenue", header: "Revenue", render: (v: number) => formatEtb(v) },
                    { key: "cost", header: "Cost", render: (v: number) => formatEtb(v) },
                    { key: "profit", header: "Profit", render: (v: number) => formatEtb(v) },
                  ]}
                />
              </>
            )}

            {tab === "low-stock" && data && (
              <SimpleTable
                rows={data.products}
                columns={[
                  { key: "name", header: "Product" },
                  { key: "current_stock", header: "Current Stock" },
                  { key: "minimum_stock", header: "Minimum Stock" },
                ]}
              />
            )}

            {tab === "employee-sales" && data && (
              <SimpleTable
                rows={data.employees}
                columns={[
                  { key: "name", header: "Employee" },
                  { key: "orderCount", header: "Orders" },
                  { key: "total", header: "Total Sales", render: (v: number) => formatEtb(v) },
                ]}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

const SummaryRow: React.FC<{ items: [string, React.ReactNode][] }> = ({ items }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
    {items.map(([label, value]) => (
      <div key={label} className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-3">
        <p className="text-[11px] font-bold text-zinc-400">{label.toUpperCase()}</p>
        <p className="text-base font-black">{value}</p>
      </div>
    ))}
  </div>
);

function SimpleTable({ rows, columns }: { rows: any[]; columns: { key: string; header: string; render?: (v: any) => React.ReactNode }[] }) {
  if (!rows || rows.length === 0) return <p className="text-xs text-zinc-400 text-center py-8">No data for this period.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
            {columns.map((c) => <th key={c.key} className="px-3 py-2 font-bold">{c.header}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-zinc-50 dark:border-zinc-800/60">
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-2 text-xs">{c.render ? c.render(row[c.key]) : row[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
