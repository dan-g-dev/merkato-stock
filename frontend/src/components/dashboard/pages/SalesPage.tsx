import React, { useEffect, useState } from "react";
import { Plus, Trash2, Download, Receipt as ReceiptIcon } from "lucide-react";
import { api, downloadCsv } from "../../../services/api";
import { formatEtb, formatDateTime } from "../../../utils/format";
import { useAuth } from "../../../context/AuthContext";
import { LoadingSpinner, EmptyState, ErrorState, Pagination, useToast } from "../ui/Ui";
import { ReceiptModal } from "./ReceiptModal";
import type { Sale, Product, Customer, Pagination as PaginationType, PaymentMethod } from "../../../types";

interface DraftLine { productId: string; quantity: string }

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "CASH", label: "Cash" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "MOBILE_MONEY", label: "Mobile Money" },
  { value: "TELEBIRR", label: "Telebirr" },
];

export const SalesPage: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [discount, setDiscount] = useState("0");
  const [lines, setLines] = useState<DraftLine[]>([{ productId: "", quantity: "1" }]);
  const [formError, setFormError] = useState<string | null>(null);
  const [receiptSale, setReceiptSale] = useState<Sale | null>(null);

  const productById = (id: number) => products.find((p) => p.id === id);

  const load = () => {
    setIsLoading(true);
    api.get(`/sales?page=${page}&pageSize=10`).then((res) => { setSales(res.sales); setPagination(res.pagination); setError(null); }).catch((err) => setError(err.message)).finally(() => setIsLoading(false));
  };
  useEffect(load, [page]);
  useEffect(() => {
    api.get("/products?pageSize=1000").then((res) => setProducts(res.products)).catch(() => {});
    api.get("/customers").then((res) => setCustomers(res.customers)).catch(() => {});
  }, []);

  const openCreate = () => {
    setCustomerId("");
    setPaymentMethod("CASH");
    setDiscount("0");
    setLines([{ productId: "", quantity: "1" }]);
    setFormError(null);
    setIsModalOpen(true);
  };

  const updateLine = (index: number, patch: Partial<DraftLine>) => {
    setLines((prev) => prev.map((line, i) => (i === index ? { ...line, ...patch } : line)));
  };

  const subtotal = lines.reduce((sum, l) => {
    const product = productById(Number(l.productId));
    return sum + (product ? product.selling_price * (Number(l.quantity) || 0) : 0);
  }, 0);
  const total = Math.max(0, subtotal - (Number(discount) || 0));

  const handleSubmit = async () => {
    setFormError(null);
    const items = lines.filter((l) => l.productId && l.quantity).map((l) => ({ productId: Number(l.productId), quantity: Number(l.quantity) }));
    if (items.length === 0) {
      setFormError("Add at least one product to the sale.");
      return;
    }
    try {
      const res = await api.post("/sales", { customerId: customerId || null, items, discount: Number(discount) || 0, paymentMethod });
      showToast(`Sale ${res.sale.invoice_number} completed.`);
      setIsModalOpen(false);
      setReceiptSale(res.sale);
      load();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleExport = async () => {
    const csv = await api.get<string>("/sales/export.csv");
    downloadCsv(csv, "sales.csv");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[#E42528] hover:bg-[#c91d20] text-white">
          <Plus className="w-3.5 h-3.5" /> New Sale
        </button>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        {isLoading ? <LoadingSpinner /> : error ? <ErrorState message={error} /> : sales.length === 0 ? (
          <EmptyState message={user?.role === "EMPLOYEE" ? "You haven't recorded any sales yet." : "No sales recorded for this period."} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                  <th className="px-4 py-3 font-bold">Invoice</th>
                  <th className="px-4 py-3 font-bold">Customer</th>
                  <th className="px-4 py-3 font-bold">Date</th>
                  <th className="px-4 py-3 font-bold">Payment</th>
                  <th className="px-4 py-3 font-bold text-right">Total</th>
                  <th className="px-4 py-3 font-bold text-right">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s) => (
                  <tr key={s.id} className="border-b border-zinc-50 dark:border-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="px-4 py-3 font-bold">{s.invoice_number}</td>
                    <td className="px-4 py-3 text-xs">{customers.find((c) => c.id === s.customer_id)?.name || "Walk-in"}</td>
                    <td className="px-4 py-3 text-xs">{formatDateTime(s.created_at)}</td>
                    <td className="px-4 py-3 text-xs">{s.payment_method.replace("_", " ")}</td>
                    <td className="px-4 py-3 text-right font-bold text-xs">{formatEtb(s.total)}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setReceiptSale(s)} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"><ReceiptIcon className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination && <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-2xl rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-lg mb-4">New Sale</h3>
            {formError && <div className="mb-3 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-300 rounded-lg px-3 py-2">{formError}</div>}

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[11px] font-bold mb-1">Customer (optional)</label>
                <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent">
                  <option value="">Walk-in customer</option>
                  {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold mb-1">Payment Method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent">
                  {PAYMENT_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
                {paymentMethod === "TELEBIRR" && (
                  <p className="text-[10px] text-amber-600 mt-1">Telebirr requires live provider configuration - this demo records it without verifying a real transaction.</p>
                )}
              </div>
            </div>

            <p className="text-[11px] font-bold mb-1">Products</p>
            <div className="space-y-2 mb-2">
              {lines.map((line, i) => {
                const product = productById(Number(line.productId));
                const requested = Number(line.quantity) || 0;
                const overStock = !!product && requested > product.current_stock;
                return (
                  <div key={i}>
                    <div className="flex gap-2 items-center">
                      <select value={line.productId} onChange={(e) => updateLine(i, { productId: e.target.value })} className="flex-1 px-2 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent">
                        <option value="">Select product...</option>
                        {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.current_stock} {p.unit} left)</option>)}
                      </select>
                      <input type="number" min={1} value={line.quantity} onChange={(e) => updateLine(i, { quantity: e.target.value })} className="w-20 px-2 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
                      <span className="w-24 text-right text-xs font-bold">{product ? formatEtb(product.selling_price * requested) : "-"}</span>
                      <button onClick={() => setLines((prev) => prev.filter((_, idx) => idx !== i))} className="p-1.5 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    {overStock && <p className="text-[10px] text-red-500 mt-0.5 ml-1">Only {product!.current_stock} {product!.unit} in stock.</p>}
                  </div>
                );
              })}
            </div>
            <button onClick={() => setLines((prev) => [...prev, { productId: "", quantity: "1" }])} className="text-xs font-bold text-red-500 hover:underline mb-3">
              + Add another product
            </button>

            <div className="flex items-center justify-between gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-3">
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-bold">Discount (ETB)</label>
                <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-24 px-2 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-zinc-400">Total</p>
                <p className="text-lg font-black">{formatEtb(total)}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-xs font-bold border border-zinc-200 dark:border-zinc-700">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 rounded-lg text-xs font-bold bg-[#E42528] hover:bg-[#c91d20] text-white">Complete Sale</button>
            </div>
          </div>
        </div>
      )}

      {receiptSale && (
        <ReceiptModal
          sale={receiptSale}
          products={products}
          customer={customers.find((c) => c.id === receiptSale.customer_id) || null}
          onClose={() => setReceiptSale(null)}
        />
      )}
    </div>
  );
};
