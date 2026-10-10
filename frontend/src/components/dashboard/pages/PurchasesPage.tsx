import React, { useEffect, useState } from "react";
import { Plus, PackageCheck, Trash2 } from "lucide-react";
import { api } from "../../../services/api";
import { formatEtb, formatDate } from "../../../utils/format";
import { useToast } from "../ui/Ui";
import { LoadingSpinner, EmptyState, ErrorState, purchaseStatusBadge, ConfirmModal } from "../ui/Ui";
import type { PurchaseOrder, Supplier, Product } from "../../../types";

interface DraftLine { productId: string; quantity: string; unitCost: string }

export const PurchasesPage: React.FC = () => {
  const { showToast } = useToast();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<DraftLine[]>([{ productId: "", quantity: "", unitCost: "" }]);
  const [formError, setFormError] = useState<string | null>(null);
  const [receiveTarget, setReceiveTarget] = useState<PurchaseOrder | null>(null);

  const load = () => {
    setIsLoading(true);
    api.get("/purchases?pageSize=50").then((res) => { setPurchaseOrders(res.purchaseOrders); setError(null); }).catch((err) => setError(err.message)).finally(() => setIsLoading(false));
  };
  useEffect(load, []);
  useEffect(() => {
    api.get("/suppliers").then((res) => setSuppliers(res.suppliers)).catch(() => {});
    api.get("/products?pageSize=1000").then((res) => setProducts(res.products)).catch(() => {});
  }, []);

  const productName = (id: number) => products.find((p) => p.id === id)?.name || `#${id}`;

  const openCreate = () => {
    setSupplierId("");
    setNotes("");
    setLines([{ productId: "", quantity: "", unitCost: "" }]);
    setFormError(null);
    setIsModalOpen(true);
  };

  const updateLine = (index: number, patch: Partial<DraftLine>) => {
    setLines((prev) => prev.map((line, i) => (i === index ? { ...line, ...patch } : line)));
  };

  const total = lines.reduce((sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.unitCost) || 0), 0);

  const handleSubmit = async (submit: boolean) => {
    setFormError(null);
    const items = lines.filter((l) => l.productId && l.quantity).map((l) => ({ productId: Number(l.productId), quantity: Number(l.quantity), unitCost: Number(l.unitCost) }));
    if (!supplierId || items.length === 0) {
      setFormError("Choose a supplier and add at least one product.");
      return;
    }
    try {
      await api.post("/purchases", { supplierId: Number(supplierId), notes, items, submit });
      showToast(submit ? "Purchase order submitted." : "Draft saved.");
      setIsModalOpen(false);
      load();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleReceive = async () => {
    if (!receiveTarget) return;
    try {
      await api.post(`/purchases/${receiveTarget.id}/receive`);
      showToast(`${receiveTarget.purchase_order_number} received - inventory updated.`);
      load();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setReceiveTarget(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCreate} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[#E42528] hover:bg-[#c91d20] text-white">
          <Plus className="w-3.5 h-3.5" /> New Purchase Order
        </button>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        {isLoading ? <LoadingSpinner /> : error ? <ErrorState message={error} /> : purchaseOrders.length === 0 ? (
          <EmptyState message="No purchase orders yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                  <th className="px-4 py-3 font-bold">PO Number</th>
                  <th className="px-4 py-3 font-bold">Supplier</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold text-right">Total</th>
                  <th className="px-4 py-3 font-bold">Date</th>
                  <th className="px-4 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map((po) => (
                  <tr key={po.id} className="border-b border-zinc-50 dark:border-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 align-top">
                    <td className="px-4 py-3 font-bold">
                      {po.purchase_order_number}
                      <ul className="mt-1 space-y-0.5">
                        {po.items.map((item) => (
                          <li key={item.id} className="text-[11px] font-normal text-zinc-400">{item.quantity}x {productName(item.product_id)}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3 text-xs">{suppliers.find((s) => s.id === po.supplier_id)?.company_name || "-"}</td>
                    <td className="px-4 py-3">{purchaseStatusBadge(po.status)}</td>
                    <td className="px-4 py-3 text-right font-bold text-xs">{formatEtb(po.total)}</td>
                    <td className="px-4 py-3 text-xs">{formatDate(po.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      {(po.status === "PENDING" || po.status === "DRAFT") && (
                        <button onClick={() => setReceiveTarget(po)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                          <PackageCheck className="w-3.5 h-3.5" /> Receive
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-2xl rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-lg mb-4">New Purchase Order</h3>
            {formError && <div className="mb-3 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-300 rounded-lg px-3 py-2">{formError}</div>}

            <label className="block text-[11px] font-bold mb-1">Supplier *</label>
            <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="w-full px-3 py-2 mb-3 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent">
              <option value="">Select a supplier...</option>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{s.company_name}</option>)}
            </select>

            <label className="block text-[11px] font-bold mb-1">Notes</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 mb-3 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />

            <p className="text-[11px] font-bold mb-1">Products</p>
            <div className="space-y-2 mb-2">
              {lines.map((line, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <select value={line.productId} onChange={(e) => updateLine(i, { productId: e.target.value })} className="flex-1 px-2 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent">
                    <option value="">Select product...</option>
                    {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <input type="number" placeholder="Qty" value={line.quantity} onChange={(e) => updateLine(i, { quantity: e.target.value })} className="w-20 px-2 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
                  <input type="number" placeholder="Unit Cost" value={line.unitCost} onChange={(e) => updateLine(i, { unitCost: e.target.value })} className="w-28 px-2 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
                  <button onClick={() => setLines((prev) => prev.filter((_, idx) => idx !== i))} className="p-1.5 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
            <button onClick={() => setLines((prev) => [...prev, { productId: "", quantity: "", unitCost: "" }])} className="text-xs font-bold text-red-500 hover:underline mb-3">
              + Add another line
            </button>

            <div className="flex justify-between items-center border-t border-zinc-100 dark:border-zinc-800 pt-3 mb-3">
              <span className="text-xs font-bold text-zinc-500">Total</span>
              <span className="text-lg font-black">{formatEtb(total)}</span>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-xs font-bold border border-zinc-200 dark:border-zinc-700">Cancel</button>
              <button onClick={() => handleSubmit(false)} className="px-4 py-2 rounded-lg text-xs font-bold border border-zinc-300 dark:border-zinc-600">Save as Draft</button>
              <button onClick={() => handleSubmit(true)} className="px-4 py-2 rounded-lg text-xs font-bold bg-[#E42528] hover:bg-[#c91d20] text-white">Submit Order</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!receiveTarget}
        title="Receive this purchase order?"
        message={`Marking ${receiveTarget?.purchase_order_number} as received will add its items to inventory.`}
        confirmLabel="Receive"
        onConfirm={handleReceive}
        onCancel={() => setReceiveTarget(null)}
      />
    </div>
  );
};
