import React, { createContext, useCallback, useContext, useState } from "react";
import { Loader2, Inbox, AlertTriangle, CheckCircle2, X } from "lucide-react";

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = "Loading..." }) => (
  <div className="flex items-center justify-center gap-2 py-12 text-zinc-500 dark:text-zinc-400">
    <Loader2 className="w-5 h-5 animate-spin" />
    <span className="text-sm">{label}</span>
  </div>
);

export const EmptyState: React.FC<{ message: string; subtext?: string }> = ({ message, subtext }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-zinc-400 dark:text-zinc-500">
    <Inbox className="w-8 h-8" />
    <p className="text-sm font-semibold">{message}</p>
    {subtext && <p className="text-xs">{subtext}</p>}
  </div>
);

export const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-red-500">
    <AlertTriangle className="w-8 h-8" />
    <p className="text-sm font-semibold">{message}</p>
  </div>
);

export const Badge: React.FC<{ tone: "green" | "red" | "amber" | "zinc" | "blue"; children: React.ReactNode }> = ({ tone, children }) => {
  const toneClasses: Record<string, string> = {
    green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    red: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    zinc: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${toneClasses[tone]}`}>{children}</span>;
};

export function stockStatusBadge(status?: string) {
  if (status === "OUT_OF_STOCK") return <Badge tone="red">Out of Stock</Badge>;
  if (status === "LOW_STOCK") return <Badge tone="amber">Low Stock</Badge>;
  return <Badge tone="green">In Stock</Badge>;
}

export function purchaseStatusBadge(status: string) {
  const toneMap: Record<string, "zinc" | "amber" | "green" | "red"> = { DRAFT: "zinc", PENDING: "amber", RECEIVED: "green", CANCELLED: "red" };
  return <Badge tone={toneMap[status] || "zinc"}>{status}</Badge>;
}

export const Pagination: React.FC<{ page: number; totalPages: number; onPageChange: (page: number) => void }> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 py-4 text-sm">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-800"
      >
        Previous
      </button>
      <span className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-800"
      >
        Next
      </button>
    </div>
  );
};

export const ConfirmModal: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, title, message, confirmLabel = "Confirm", onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-sm rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5 shadow-2xl">
        <h4 className="font-bold text-zinc-900 dark:text-white">{title}</h4>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">{message}</p>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onCancel} className="px-3.5 py-2 rounded-lg text-xs font-bold border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-3.5 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- Toasts -------------------------------------------------------

interface Toast {
  id: number;
  message: string;
  tone: "success" | "error";
}

interface ToastContextValue {
  showToast: (message: string, tone?: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, tone: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-semibold text-white ${
              toast.tone === "success" ? "bg-emerald-600" : "bg-red-600"
            }`}
          >
            {toast.tone === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {toast.message}
            <button onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}>
              <X className="w-3.5 h-3.5 opacity-70 hover:opacity-100" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
