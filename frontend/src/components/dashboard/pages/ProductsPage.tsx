import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Download, Pencil, Trash2, Barcode } from "lucide-react";
import { api, downloadCsv } from "../../../services/api";
import { formatEtb } from "../../../utils/format";
import { useAuth } from "../../../context/AuthContext";
import { LoadingSpinner, EmptyState, ErrorState, Pagination, ConfirmModal, stockStatusBadge, useToast } from "../ui/Ui";
import type { Product, Category, Supplier, Pagination as PaginationType } from "../../../types";

const emptyForm = {
  sku: "",
  barcode: "",
  name: "",
  description: "",
  category_id: "",
  supplier_id: "",
  cost_price: "",
  selling_price: "",
  current_stock: "",
  minimum_stock: "",
  unit: "pcs",
};

export const ProductsPage: React.FC = () => {
  const { hasRole } = useAuth();
  const { showToast } = useToast();
  const canManage = hasRole("ADMIN", "MANAGER");

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const categoryName = (id: number | null) => categories.find((c) => c.id === id)?.name || "-";
  const supplierName = (id: number | null) => suppliers.find((s) => s.id === id)?.company_name || "-";

  const loadProducts = () => {
    setIsLoading(true);
    const params = new URLSearchParams({ search, category: categoryFilter, stockFilter, page: String(page), pageSize: "10" });
    api
      .get(`/products?${params.toString()}`)
      .then((res) => {
        setProducts(res.products);
        setPagination(res.pagination);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.categories)).catch(() => {});
    api.get("/suppliers").then((res) => setSuppliers(res.suppliers)).catch(() => {});
  }, []);

  useEffect(loadProducts, [search, categoryFilter, stockFilter, page]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      sku: product.sku,
      barcode: product.barcode || "",
      name: product.name,
      description: product.description || "",
      category_id: product.category_id ? String(product.category_id) : "",
      supplier_id: product.supplier_id ? String(product.supplier_id) : "",
      cost_price: String(product.cost_price),
      selling_price: String(product.selling_price),
      current_stock: String(product.current_stock),
      minimum_stock: String(product.minimum_stock),
      unit: product.unit,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const payload = {
      ...form,
      barcode: form.barcode || null,
      category_id: form.category_id || null,
      supplier_id: form.supplier_id || null,
      cost_price: Number(form.cost_price),
      selling_price: Number(form.selling_price),
      current_stock: Number(form.current_stock),
      minimum_stock: Number(form.minimum_stock),
    };
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
        showToast("Product updated.");
      } else {
        await api.post("/products", payload);
        showToast("Product created.");
      }
      setIsModalOpen(false);
      loadProducts();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/products/${deleteTarget.id}`);
      showToast("Product deleted.");
      setDeleteTarget(null);
      loadProducts();
    } catch (err: any) {
      showToast(err.message, "error");
      setDeleteTarget(null);
    }
  };

  const handleExport = async () => {
    const csv = await api.get<string>(`/products/export.csv?search=${encodeURIComponent(search)}`);
    downloadCsv(csv, "products.csv");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
              placeholder="Search name, SKU, or barcode..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => { setPage(1); setCategoryFilter(e.target.value); }}
            className="px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select
            value={stockFilter}
            onChange={(e) => { setPage(1); setStockFilter(e.target.value); }}
            className="px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
          >
            <option value="">All Stock Levels</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          {canManage && (
            <button onClick={openCreateModal} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[#E42528] hover:bg-[#c91d20] text-white">
              <Plus className="w-3.5 h-3.5" /> Add Product
            </button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorState message={error} />
        ) : products.length === 0 ? (
          <EmptyState message="No products found." subtext="Try a different search or filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                  <th className="px-4 py-3 font-bold">Product</th>
                  <th className="px-4 py-3 font-bold">SKU</th>
                  <th className="px-4 py-3 font-bold">Category</th>
                  <th className="px-4 py-3 font-bold text-right">Cost</th>
                  <th className="px-4 py-3 font-bold text-right">Selling Price</th>
                  <th className="px-4 py-3 font-bold text-right">Stock</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  {canManage && <th className="px-4 py-3 font-bold text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-zinc-50 dark:border-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="px-4 py-3">
                      <p className="font-bold">{p.name}</p>
                      {p.barcode && <p className="text-[11px] text-zinc-400 flex items-center gap-1"><Barcode className="w-3 h-3" /> {p.barcode}</p>}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{p.sku}</td>
                    <td className="px-4 py-3 text-xs">{categoryName(p.category_id)}</td>
                    <td className="px-4 py-3 text-right text-xs">{formatEtb(p.cost_price)}</td>
                    <td className="px-4 py-3 text-right font-bold text-xs">{formatEtb(p.selling_price)}</td>
                    <td className="px-4 py-3 text-right text-xs">{p.current_stock} {p.unit}</td>
                    <td className="px-4 py-3">{stockStatusBadge(p.stockStatus)}</td>
                    {canManage && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openEditModal(p)} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
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
          <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-lg mb-4">{editingProduct ? "Edit Product" : "Add Product"}</h3>
            {formError && <div className="mb-3 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-300 rounded-lg px-3 py-2">{formError}</div>}
            <div className="grid grid-cols-2 gap-3">
              <LabeledInput label="SKU" required value={form.sku} onChange={(v) => setForm({ ...form, sku: v })} />
              <LabeledInput label="Barcode" value={form.barcode} onChange={(v) => setForm({ ...form, barcode: v })} />
              <LabeledInput label="Product Name" required className="col-span-2" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <LabeledInput label="Description" className="col-span-2" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
              <LabeledSelect label="Category" value={form.category_id} onChange={(v) => setForm({ ...form, category_id: v })} options={categories.map((c) => ({ value: String(c.id), label: c.name }))} />
              <LabeledSelect label="Supplier" value={form.supplier_id} onChange={(v) => setForm({ ...form, supplier_id: v })} options={suppliers.map((s) => ({ value: String(s.id), label: s.company_name }))} />
              <LabeledInput label="Cost Price (ETB)" type="number" required value={form.cost_price} onChange={(v) => setForm({ ...form, cost_price: v })} />
              <LabeledInput label="Selling Price (ETB)" type="number" required value={form.selling_price} onChange={(v) => setForm({ ...form, selling_price: v })} />
              <LabeledInput label="Current Stock" type="number" required value={form.current_stock} onChange={(v) => setForm({ ...form, current_stock: v })} />
              <LabeledInput label="Minimum Stock" type="number" required value={form.minimum_stock} onChange={(v) => setForm({ ...form, minimum_stock: v })} />
              <LabeledInput label="Unit" value={form.unit} onChange={(v) => setForm({ ...form, unit: v })} />
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-xs font-bold border border-zinc-200 dark:border-zinc-700">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg text-xs font-bold bg-[#E42528] hover:bg-[#c91d20] text-white">
                {editingProduct ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete this product?"
        message={`"${deleteTarget?.name}" will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

const LabeledInput: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; className?: string }> = ({
  label, value, onChange, type = "text", required, className = "",
}) => (
  <div className={className}>
    <label className="block text-[11px] font-bold mb-1">{label}{required && <span className="text-red-500"> *</span>}</label>
    <input
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
    />
  </div>
);

const LabeledSelect: React.FC<{ label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }> = ({
  label, value, onChange, options,
}) => (
  <div>
    <label className="block text-[11px] font-bold mb-1">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-red-500 focus:outline-none">
      <option value="">Select...</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);
