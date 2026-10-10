import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, X } from "lucide-react";
import { api } from "../../../services/api";
import { formatEtb, formatDate } from "../../../utils/format";
import { LoadingSpinner, EmptyState, ErrorState, ConfirmModal, useToast, purchaseStatusBadge } from "../ui/Ui";
import type { Supplier, PurchaseOrder } from "../../../types";

const emptyForm = { company_name: "", contact_person: "", phone: "", email: "", address: "", city: "", notes: "" };

export const SuppliersPage: React.FC = () => {
  const { showToast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);
  const [profile, setProfile] = useState<{ supplier: Supplier; purchaseOrders: PurchaseOrder[]; totalPurchases: number } | null>(null);

  const load = () => {
    setIsLoading(true);
    api.get("/suppliers").then((res) => { setSuppliers(res.suppliers); setError(null); }).catch((err) => setError(err.message)).finally(() => setIsLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFormError(null); setIsModalOpen(true); };
  const openEdit = (s: Supplier) => {
    setEditing(s);
    setForm({ company_name: s.company_name, contact_person: s.contact_person || "", phone: s.phone || "", email: s.email || "", address: s.address || "", city: s.city || "", notes: s.notes || "" });
    setFormError(null);
    setIsModalOpen(true);
  };
  const viewProfile = (s: Supplier) => {
    api.get(`/suppliers/${s.id}`).then((res) => setProfile(res)).catch((err) => showToast(err.message, "error"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      if (editing) {
        await api.put(`/suppliers/${editing.id}`, form);
        showToast("Supplier updated.");
      } else {
        await api.post("/suppliers", form);
        showToast("Supplier added.");
      }
      setIsModalOpen(false);
      load();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/suppliers/${deleteTarget.id}`);
      showToast("Supplier deleted.");
      load();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCreate} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[#E42528] hover:bg-[#c91d20] text-white">
          <Plus className="w-3.5 h-3.5" /> Add Supplier
        </button>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        {isLoading ? <LoadingSpinner /> : error ? <ErrorState message={error} /> : suppliers.length === 0 ? (
          <EmptyState message="No suppliers yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                  <th className="px-4 py-3 font-bold">Company</th>
                  <th className="px-4 py-3 font-bold">Contact</th>
                  <th className="px-4 py-3 font-bold">Phone</th>
                  <th className="px-4 py-3 font-bold">City</th>
                  <th className="px-4 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s) => (
                  <tr key={s.id} className="border-b border-zinc-50 dark:border-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="px-4 py-3 font-bold">{s.company_name}</td>
                    <td className="px-4 py-3 text-xs">{s.contact_person || "-"}</td>
                    <td className="px-4 py-3 text-xs">{s.phone || "-"}</td>
                    <td className="px-4 py-3 text-xs">{s.city || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => viewProfile(s)} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteTarget(s)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
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
          <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-lg mb-4">{editing ? "Edit Supplier" : "Add Supplier"}</h3>
            {formError && <div className="mb-3 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-300 rounded-lg px-3 py-2">{formError}</div>}
            <div className="grid grid-cols-2 gap-3">
              {(["company_name", "contact_person", "phone", "email", "address", "city"] as const).map((field) => (
                <div key={field} className={field === "company_name" || field === "address" ? "col-span-2" : ""}>
                  <label className="block text-[11px] font-bold mb-1 capitalize">{field.replace("_", " ")}{field === "company_name" && " *"}</label>
                  <input
                    required={field === "company_name"}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-xs font-bold border border-zinc-200 dark:border-zinc-700">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg text-xs font-bold bg-[#E42528] hover:bg-[#c91d20] text-white">{editing ? "Save Changes" : "Create"}</button>
            </div>
          </form>
        </div>
      )}

      {profile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-lg rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-black text-lg">{profile.supplier.company_name}</h3>
                <p className="text-xs text-zinc-500">{profile.supplier.contact_person} · {profile.supplier.phone}</p>
              </div>
              <button onClick={() => setProfile(null)} className="p-1.5 text-zinc-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-3 mb-4">
              <p className="text-[11px] font-bold text-zinc-400">TOTAL PURCHASES (RECEIVED)</p>
              <p className="text-lg font-black">{formatEtb(profile.totalPurchases)}</p>
            </div>
            <p className="text-xs font-bold text-zinc-400 mb-2">PURCHASE ORDER HISTORY</p>
            {profile.purchaseOrders.length === 0 ? (
              <p className="text-xs text-zinc-400">No purchase orders yet.</p>
            ) : (
              <div className="space-y-2">
                {profile.purchaseOrders.map((po) => (
                  <div key={po.id} className="flex justify-between items-center text-xs border border-zinc-100 dark:border-zinc-800 rounded-lg px-3 py-2">
                    <div>
                      <p className="font-bold">{po.purchase_order_number}</p>
                      <p className="text-zinc-400">{formatDate(po.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatEtb(po.total)}</p>
                      {purchaseStatusBadge(po.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteTarget} title="Delete this supplier?" message={`"${deleteTarget?.company_name}" will be permanently removed.`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
};
