import React from "react";
import { X, Printer } from "lucide-react";
import { formatEtb, formatDateTime } from "../../../utils/format";
import type { Sale, Product, Customer } from "../../../types";

// "PDF export" for the receipt is done via the browser's print dialog
// (Save as PDF), rather than pulling in a PDF-generation library just
// for this one document - see the note in README.md under "Design choices".
export const ReceiptModal: React.FC<{
  sale: Sale;
  products: Product[];
  customer: Customer | null;
  onClose: () => void;
}> = ({ sale, products, customer, onClose }) => {
  const productName = (id: number) => products.find((p) => p.id === id)?.name || `#${id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 print:bg-white print:p-0">
      <div className="w-full max-w-sm rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-2xl print:shadow-none print:border-0">
        <div className="flex justify-end gap-1 p-2 print:hidden">
          <button onClick={() => window.print()} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500" title="Print / Save as PDF">
            <Printer className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pb-6 font-mono text-xs text-zinc-800 dark:text-zinc-200">
          <div className="text-center mb-3">
            <p className="font-black text-sm">MERKATO STOCK</p>
            <p className="text-[10px] text-zinc-500">Smart Inventory Management</p>
          </div>
          <div className="border-t border-dashed border-zinc-300 dark:border-zinc-700 my-2" />
          <p>Invoice: {sale.invoice_number}</p>
          <p>Date: {formatDateTime(sale.created_at)}</p>
          {customer && (
            <>
              <p className="mt-2">Customer:</p>
              <p className="font-bold">{customer.name}</p>
            </>
          )}
          <div className="border-t border-dashed border-zinc-300 dark:border-zinc-700 my-2" />
          <p className="font-bold mb-1">Products:</p>
          {sale.items.map((item) => (
            <div key={item.id} className="flex justify-between mb-1.5">
              <span>{productName(item.product_id)}<br />{item.quantity} × {formatEtb(item.unit_price)}</span>
              <span>{formatEtb(item.total)}</span>
            </div>
          ))}
          <div className="border-t border-dashed border-zinc-300 dark:border-zinc-700 my-2" />
          <div className="flex justify-between"><span>Subtotal</span><span>{formatEtb(sale.subtotal)}</span></div>
          <div className="flex justify-between"><span>Discount</span><span>{formatEtb(sale.discount)}</span></div>
          <div className="flex justify-between font-bold text-sm mt-1"><span>Total</span><span>{formatEtb(sale.total)}</span></div>
          <div className="border-t border-dashed border-zinc-300 dark:border-zinc-700 my-2" />
          <p>Payment: {sale.payment_method.replace("_", " ")}</p>
          <div className="border-t border-dashed border-zinc-300 dark:border-zinc-700 my-2" />
          <p className="text-center font-bold mt-3">Thank you!</p>
        </div>
      </div>
    </div>
  );
};
