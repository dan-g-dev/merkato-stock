import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, X, Search } from "lucide-react";
import { api } from "../../../services/api";
import { formatEtb, formatDate } from "../../../utils/format";
import { LoadingSpinner, EmptyState, ErrorState, ConfirmModal, useToast } from "../ui/Ui";
import type { Customer, Sale } from "../../../types";

const emptyForm = { name: "", phone: "", email: "", address: "", city: "", notes: "" };

export const CustomersPage: React.FC = () => {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [profile, setProfile] = useState<{ customer: Customer; sales: Sale[]; totalSpent: number; orderCount: number } | null>(null);

  const load = () => {
    setIsLoading(true);
    api.get(`/customers?search=${encodeURIComponent(search)}`).then((res) => { setCustomers(res.customers); setError(null); }).catch((err) => setError(err.message)).finally(() => setIsLoading(false));
  };
  useEffect(load, [search]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFormError(null); setIsModalOpen(true); };
  const openEdit = (c: Customer) => {
    setEditing(c);
    setForm({ name: c.name, phone: c.phone || "", email: c.email || "", address: c.address || "", city: c.city || "", notes: c.notes || "" });
    setFormError(null);
    setIsModalOpen(true);
  };
  const viewProfile = (c: Customer) => {
    api.get(`/customers/${c.id}`).then((res) => setProfile(res)).catch((err) => showToast(err.message, "error"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      if (editing) {
        await api.put(`/customers/${editing.id}`, form);
        showToast("Customer updated.");
      } else {
        await api.post("/customers", form);
        showToast("Customer added.");
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
      await api.delete(`/customers/${deleteTarget.id}`);
      showToast("Customer deleted.");
      load();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[#E42528] hover:bg-[#c91d20] text-white">
          <Plus className="w-3.5 h-3.5" /> Add Customer
        </button>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        {isLoading ? <LoadingSpinner /> : error ? <ErrorState message={error} /> : customers.length === 0 ? (
          <EmptyState message="No customers found." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                  <th className="px-4 py-3 font-bold">Name</th>
                  <th className="px-4 py-3 font-bold">Phone</th>
                  <th className="px-4 py-3 font-bold">City</th>
                  <th className="px-4 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b border-zinc-50 dark:border-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="px-4 py-3 font-bold">{c.name}</td>
                    <td className="px-4 py-3 text-xs">{c.phone || "-"}</td>
                    <td className="px-4 py-3 text-xs">{c.city || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => viewProfile(c)} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteTarget(c)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
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
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5 shadow-2xl">
            <h3 className="font-black text-lg mb-4">{editing ? "Edit Customer" : "Add Customer"}</h3>
            {formError && <div className="mb-3 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-300 rounded-lg px-3 py-2">{formError}</div>}
            <div className="grid grid-cols-2 gap-3">
              {(["name", "phone", "email", "city", "address", "notes"] as const).map((field) => (
                <div key={field} className={field === "name" || field === "address" || field === "notes" ? "col-span-2" : ""}>
                  <label className="block text-[11px] font-bold mb-1 capitalize">{field}{field === "name" && " *"}</label>
                  <input
                    required={field === "name"}
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
                <h3 className="font-black text-lg">{profile.customer.name}</h3>
                <p className="text-xs text-zinc-500">{profile.customer.phone} · {profile.customer.city}</p>
              </div>
              <button onClick={() => setProfile(null)} className="p-1.5 text-zinc-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-3">
                <p className="text-[11px] font-bold text-zinc-400">TOTAL SPENT</p>
                <p className="text-lg font-black">{formatEtb(profile.totalSpent)}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-3">
                <p className="text-[11px] font-bold text-zinc-400">ORDERS</p>
                <p className="text-lg font-black">{profile.orderCount}</p>
              </div>
            </div>
            <p className="text-xs font-bold text-zinc-400 mb-2">PURCHASE HISTORY</p>
            {profile.sales.length === 0 ? (
              <p className="text-xs text-zinc-400">No purchases yet.</p>
            ) : (
              <div className="space-y-2">
                {profile.sales.map((s) => (
                  <div key={s.id} className="flex justify-between items-center text-xs border border-zinc-100 dark:border-zinc-800 rounded-lg px-3 py-2">
                    <div>
                      <p className="font-bold">{s.invoice_number}</p>
                      <p className="text-zinc-400">{formatDate(s.created_at)}</p>
                    </div>
                    <p className="font-bold">{formatEtb(s.total)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteTarget} title="Delete this customer?" message={`"${deleteTarget?.name}" will be permanently removed.`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
};
