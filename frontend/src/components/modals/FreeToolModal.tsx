import React, { useState } from "react";
import { X, Barcode, Calculator, Download, Check } from "lucide-react";

interface FreeToolModalProps {
  toolName: string | null;
  onClose: () => void;
  isDarkMode: boolean;
}

export const FreeToolModal: React.FC<FreeToolModalProps> = ({
  toolName,
  onClose,
  isDarkMode,
}) => {
  const [skuText, setSkuText] = useState("SHIRT-NVY-L");
  const [barcodeType, setBarcodeType] = useState("CODE128");

  // Reorder point calculator state
  const [dailySales, setDailySales] = useState(15);
  const [leadTimeDays, setLeadTimeDays] = useState(7);
  const [safetyStock, setSafetyStock] = useState(20);

  if (!toolName) return null;

  const calculatedReorderPoint = dailySales * leadTimeDays + safetyStock;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in-50 duration-150">
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 relative ${
          isDarkMode ? "bg-zinc-900 border-zinc-700 text-white" : "bg-white border-zinc-200 text-zinc-900"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-xs font-bold text-[#E42528] uppercase tracking-wider mb-1">
          FREE MERKATO STOCK TOOL
        </div>
        <h3 className="text-xl font-black mb-4">{toolName}</h3>

        {toolName.toLowerCase().includes("barcode") || toolName.toLowerCase().includes("sku") ? (
          /* Interactive Barcode Generator */
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-zinc-600 dark:text-zinc-400">
                Item SKU / Barcode Value
              </label>
              <input
                type="text"
                value={skuText}
                onChange={(e) => setSkuText(e.target.value.toUpperCase())}
                placeholder="e.g. AG-RIM-19-RED"
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent uppercase font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-zinc-600 dark:text-zinc-400">
                Barcode Standard
              </label>
              <select
                value={barcodeType}
                onChange={(e) => setBarcodeType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none"
              >
                <option value="CODE128">Code 128 (High Density Logistics)</option>
                <option value="EAN13">EAN-13 (Retail Standard)</option>
                <option value="UPCA">UPC-A (North American Retail)</option>
              </select>
            </div>

            {/* Simulated rendered barcode preview */}
            <div className="p-6 rounded-xl bg-white text-black border border-zinc-300 text-center flex flex-col items-center justify-center shadow-inner">
              <div className="font-mono text-3xl font-black tracking-[0.25em] select-all">
                ||| | |||| || ||||| | ||||
              </div>
              <div className="font-mono text-xs font-bold mt-2 tracking-widest">
                *{skuText || "BARCODE"}*
              </div>
            </div>

            <button
              onClick={() => alert(`Generated barcode label for ${skuText} downloaded.`)}
              className="w-full py-2.5 rounded-lg bg-[#E42528] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-red-700 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Printable Vector SVG</span>
            </button>
          </div>
        ) : (
          /* Interactive Reorder Point Calculator */
          <div className="space-y-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Formula: (Average Daily Sales × Lead Time in Days) + Safety Stock
            </p>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-bold mb-1">Daily Sales</label>
                <input
                  type="number"
                  value={dailySales}
                  onChange={(e) => setDailySales(Number(e.target.value) || 0)}
                  className="w-full p-2 text-xs rounded border border-zinc-300 dark:border-zinc-700 bg-transparent text-center font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold mb-1">Lead Time (Days)</label>
                <input
                  type="number"
                  value={leadTimeDays}
                  onChange={(e) => setLeadTimeDays(Number(e.target.value) || 0)}
                  className="w-full p-2 text-xs rounded border border-zinc-300 dark:border-zinc-700 bg-transparent text-center font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold mb-1">Safety Stock</label>
                <input
                  type="number"
                  value={safetyStock}
                  onChange={(e) => setSafetyStock(Number(e.target.value) || 0)}
                  className="w-full p-2 text-xs rounded border border-zinc-300 dark:border-zinc-700 bg-transparent text-center font-bold"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-center">
              <div className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                Recommended Reorder Point
              </div>
              <div className="text-3xl font-black text-red-600 dark:text-red-400 my-1">
                {calculatedReorderPoint} Units
              </div>
              <div className="text-[10px] text-zinc-500">
                Trigger purchase order when stock reaches {calculatedReorderPoint}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs uppercase"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
