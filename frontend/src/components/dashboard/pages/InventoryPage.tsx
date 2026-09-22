import React, { useEffect, useState } from "react";
import { Download, SlidersHorizontal, X } from "lucide-react";
import { api, downloadCsv } from "../../../services/api";
import { formatDateTime } from "../../../utils/format";
import { useAuth } from "../../../context/AuthContext";
import { LoadingSpinner, EmptyState, ErrorState, stockStatusBadge, useToast, Badge } from "../ui/Ui";
import type { Product, InventoryTransaction } from "../../../types";

export const InventoryPage: React.FC = () => {
  const { hasRole } = useAuth();
  const { showToast } = useToast();
  const canAdjust = hasRole("ADMIN", "MANAGER");

  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [historyProduct, setHistoryProduct] = useState<Product | null>(null);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);

  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null);
  const [direction, setDirection] = useState<"IN" | "OUT">("IN");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const load = () => {
    setIsLoading(true);
    api.get("/inventory").then((res) => { setItems(res.items); setError(null); }).catch((err) => setError(err.message)).finally(() => setIsLoading(false));
  };
  useEffect(load, []);

  const openHistory = (product: Product) => {
    setHistoryProduct(product);
    api.get(`/inventory/${product.id}`).then((res) => setTransactions(res.transactions)).catch(() => {});
  };

  const openAdjust = (product: Product) => {
    setAdjustProduct(product);
    setDirection("IN");
    setQuantity("");
    setNotes("");
    setFormError(null);
  };

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustProduct) return;
    setFormError(null);
    try {
      await api.post("/inventory/adjust", { productId: adjustProduct.id, direction, quantity: Number(quantity), notes });
      showToast("Stock adjusted.");
      setAdjustProduct(null);
      load();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleExport = async () => {
    const csv = await api.get<string>("/inventory/transactions/export.csv");
    downloadCsv(csv, "inventory-transactions.csv");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800">
          <Download className="w-3.5 h-3.5" /> Export Transactions CSV
        </button>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        {isLoading ? <LoadingSpinner /> : error ? <ErrorState message={error} /> : items.length === 0 ? (
          <EmptyState message="No products in inventory." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                  <th className="px-4 py-3 font-bold">Product</th>
                  <th className="px-4 py-3 font-bold text-right">Current Stock</th>
                  <th className="px-4 py-3 font-bold text-right">Minimum</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p: any) => (
                  <tr key={p.id} className="border-b border-zinc-50 dark:border-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="px-4 py-3 font-bold">{p.name}</td>
                    <td className="px-4 py-3 text-right text-xs">{p.current_stock} {p.unit}</td>
                    <td className="px-4 py-3 text-right text-xs">{p.minimum_stock} {p.unit}</td>
                    <td className="px-4 py-3">{stockStatusBadge(p.stockStatus)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openHistory(p)} className="text-[11px] font-bold text-zinc-500 hover:underline">History</button>
                        {canAdjust && (
                          <button onClick={() => openAdjust(p)} className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500 hover:underline">
                            <SlidersHorizontal className="w-3 h-3" /> Adjust
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {historyProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-lg rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-black text-lg">{historyProduct.name} - Stock History</h3>
              <button onClick={() => setHistoryProduct(null)} className="p-1.5 text-zinc-400"><X className="w-4 h-4" /></button>
            </div>
            {transactions.length === 0 ? (
              <p className="text-xs text-zinc-400">No stock movements recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {transactions.map((t) => (
                  <div key={t.id} className="flex justify-between items-center text-xs border border-zinc-100 dark:border-zinc-800 rounded-lg px-3 py-2">
                    <div>
                      <Badge tone={t.type === "SALE" || t.type === "ADJUSTMENT_OUT" ? "red" : "green"}>{t.type.replace("_", " ")}</Badge>
                      <p className="text-zinc-400 mt-1">{formatDateTime(t.created_at)}</p>
                      {t.notes && <p className="text-zinc-400">{t.notes}</p>}
                    </div>
                    <div className="text-right font-bold">
                      {t.previous_quantity} → {t.new_quantity}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {adjustProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <form onSubmit={handleAdjust} className="w-full max-w-sm rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5 shadow-2xl">
            <h3 className="font-black text-lg mb-1">Adjust Stock</h3>
            <p className="text-xs text-zinc-500 mb-4">{adjustProduct.name} · currently {adjustProduct.current_stock} {adjustProduct.unit}</p>
            {formError && <div className="mb-3 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-300 rounded-lg px-3 py-2">{formError}</div>}

            <div className="grid grid-cols-2 gap-2 mb-3">
              <button type="button" onClick={() => setDirection("IN")} className={`py-2 rounded-lg text-xs font-bold border ${direction === "IN" ? "bg-emerald-600 text-white border-emerald-600" : "border-zinc-300 dark:border-zinc-700"}`}>Stock In (+)</button>
              <button type="button" onClick={() => setDirection("OUT")} className={`py-2 rounded-lg text-xs font-bold border ${direction === "OUT" ? "bg-red-600 text-white border-red-600" : "border-zinc-300 dark:border-zinc-700"}`}>Stock Out (-)</button>
            </div>
            <label className="block text-[11px] font-bold mb-1">Quantity *</label>
            <input type="number" required min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full px-3 py-2 mb-3 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
            <label className="block text-[11px] font-bold mb-1">Notes</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. damaged goods, stock count correction" className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />

            <div className="flex justify-end gap-2 mt-5">
              <button type="button" onClick={() => setAdjustProduct(null)} className="px-4 py-2 rounded-lg text-xs font-bold border border-zinc-200 dark:border-zinc-700">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg text-xs font-bold bg-[#E42528] hover:bg-[#c91d20] text-white">Save Adjustment</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
