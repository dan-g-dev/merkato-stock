import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { api } from "../../../services/api";
import { formatDate, formatEtb } from "../../../utils/format";
import { LoadingSpinner, EmptyState, ErrorState, Badge, useToast } from "../ui/Ui";
import type { AuthUser, Role } from "../../../types";

const emptyForm = { name: "", email: "", phone: "", password: "", role: "EMPLOYEE" as Role };

export const EmployeesPage: React.FC = () => {
  const { showToast } = useToast();
  const [employees, setEmployees] = useState<AuthUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [activityFor, setActivityFor] = useState<AuthUser | null>(null);
  const [activity, setActivity] = useState<{ activity: any[]; salesCount: number; salesTotal: number } | null>(null);

  const load = () => {
    setIsLoading(true);
    api.get("/employees").then((res) => { setEmployees(res.employees); setError(null); }).catch((err) => setError(err.message)).finally(() => setIsLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setForm(emptyForm); setFormError(null); setIsModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await api.post("/employees", form);
      showToast("Employee added.");
      setIsModalOpen(false);
      load();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const toggleStatus = async (employee: AuthUser) => {
    try {
      await api.put(`/employees/${employee.id}`, { status: employee.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" });
      showToast(employee.status === "ACTIVE" ? "Employee deactivated." : "Employee activated.");
      load();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const changeRole = async (employee: AuthUser, role: Role) => {
    try {
      await api.put(`/employees/${employee.id}`, { role });
      showToast("Role updated.");
      load();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const viewActivity = (employee: AuthUser) => {
    setActivityFor(employee);
    api.get(`/employees/${employee.id}/activity`).then(setActivity).catch(() => {});
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCreate} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[#E42528] hover:bg-[#c91d20] text-white">
          <Plus className="w-3.5 h-3.5" /> Add Employee
        </button>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        {isLoading ? <LoadingSpinner /> : error ? <ErrorState message={error} /> : employees.length === 0 ? (
          <EmptyState message="No employees yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                  <th className="px-4 py-3 font-bold">Name</th>
                  <th className="px-4 py-3 font-bold">Email</th>
                  <th className="px-4 py-3 font-bold">Role</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">Joined</th>
                  <th className="px-4 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className="border-b border-zinc-50 dark:border-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="px-4 py-3 font-bold">{emp.name}</td>
                    <td className="px-4 py-3 text-xs">{emp.email}</td>
                    <td className="px-4 py-3">
                      <select value={emp.role} onChange={(e) => changeRole(emp, e.target.value as Role)} className="text-xs font-bold px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent">
                        <option value="ADMIN">ADMIN</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="EMPLOYEE">EMPLOYEE</option>
                      </select>
                    </td>
                    <td className="px-4 py-3"><Badge tone={emp.status === "ACTIVE" ? "green" : "red"}>{emp.status}</Badge></td>
                    <td className="px-4 py-3 text-xs">{formatDate(emp.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => viewActivity(emp)} className="text-[11px] font-bold text-zinc-500 hover:underline">Activity</button>
                        <button onClick={() => toggleStatus(emp)} className={`text-[11px] font-bold hover:underline ${emp.status === "ACTIVE" ? "text-red-500" : "text-emerald-600"}`}>
                          {emp.status === "ACTIVE" ? "Deactivate" : "Activate"}
                        </button>
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
          <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5 shadow-2xl">
            <h3 className="font-black text-lg mb-4">Add Employee</h3>
            {formError && <div className="mb-3 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-300 rounded-lg px-3 py-2">{formError}</div>}
            <label className="block text-[11px] font-bold mb-1">Full Name *</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 mb-3 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
            <label className="block text-[11px] font-bold mb-1">Email *</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 mb-3 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
            <label className="block text-[11px] font-bold mb-1">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 mb-3 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
            <label className="block text-[11px] font-bold mb-1">Temporary Password *</label>
            <input required type="text" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2 mb-3 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent" />
            <label className="block text-[11px] font-bold mb-1">Role *</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })} className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent">
              <option value="ADMIN">ADMIN</option>
              <option value="MANAGER">MANAGER</option>
              <option value="EMPLOYEE">EMPLOYEE</option>
            </select>
            <div className="flex justify-end gap-2 mt-5">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-xs font-bold border border-zinc-200 dark:border-zinc-700">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg text-xs font-bold bg-[#E42528] hover:bg-[#c91d20] text-white">Add Employee</button>
            </div>
          </form>
        </div>
      )}

      {activityFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-lg rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-black text-lg">{activityFor.name}'s Activity</h3>
              <button onClick={() => setActivityFor(null)} className="p-1.5 text-zinc-400"><X className="w-4 h-4" /></button>
            </div>
            {activity && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-3">
                  <p className="text-[11px] font-bold text-zinc-400">SALES COUNT</p>
                  <p className="text-lg font-black">{activity.salesCount}</p>
                </div>
                <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-3">
                  <p className="text-[11px] font-bold text-zinc-400">SALES TOTAL</p>
                  <p className="text-lg font-black">{formatEtb(activity.salesTotal)}</p>
                </div>
              </div>
            )}
            {activity?.activity.length === 0 ? (
              <p className="text-xs text-zinc-400">No recorded activity yet.</p>
            ) : (
              <div className="space-y-2">
                {activity?.activity.map((a) => (
                  <div key={a.id} className="text-xs border border-zinc-100 dark:border-zinc-800 rounded-lg px-3 py-2">
                    <p className="font-bold">{a.description}</p>
                    <p className="text-zinc-400">{formatDate(a.created_at)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
