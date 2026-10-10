import React from "react";
import { CheckCircle, Truck, Package, Box, MapPin, ArrowRight, ShieldCheck } from "lucide-react";

interface PackingAndTrackingSectionProps {
  isDarkMode: boolean;
  onExplore: () => void;
}

export const PackingAndTrackingSection: React.FC<PackingAndTrackingSectionProps> = ({
  isDarkMode,
  onExplore,
}) => {
  const points = [
    "Visualize item packing with package geometry",
    "See the status of packages across carriers",
    "Integrate with 30+ leading shipping carriers",
    "Generate real-time carrier rates and barcode shipping labels",
    "Send automated SMS & email tracking updates to customers",
  ];

  return (
    <section
      className={`py-20 border-b transition-colors duration-200 ${
        isDarkMode
          ? "bg-zinc-950 border-zinc-800 text-white"
          : "bg-[#FAFAFA] border-zinc-200 text-zinc-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & Checklist */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-tight">
              From packing to tracking, it's all here
            </h2>

            <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Fulfill orders through different sales channels, right from MERKATO STOCK. Save time
              in managing shipping and gain customer trust by sending instant updates.
            </p>

            <div className="space-y-3.5 pt-2">
              {points.map((p, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    {p}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={onExplore}
              className="flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors pt-4 cursor-pointer"
            >
              <span>Learn More about Shipping & Fulfillment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Column: Interactive Shipment Label & Geometry Tracker */}
          <div className="lg:col-span-6">
            <div
              className={`p-6 sm:p-8 rounded-2xl border shadow-xl ${
                isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
              }`}
            >
              {/* Header: Recipient & Shipment ID */}
              <div className="flex items-center justify-between border-b pb-4 mb-6 border-zinc-200 dark:border-zinc-800">
                <div>
                  <div className="text-base font-bold text-zinc-900 dark:text-white">
                    Aaron Brown
                  </div>
                  <div className="text-xs font-semibold text-red-600 dark:text-red-400">
                    SHIP-00055
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-zinc-400">Carrier</div>
                  <div className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    USPS Priority
                  </div>
                </div>
              </div>

              {/* Package Geometry Visual */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div
                  className={`p-4 rounded-xl border ${
                    isDarkMode ? "bg-zinc-950/60 border-zinc-800" : "bg-[#F8F9FB] border-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    <Box className="w-4 h-4 text-amber-500" />
                    <span>Box Geometry</span>
                  </div>
                  <div className="text-sm font-bold">Standard Carton #3</div>
                  <div className="text-xs text-zinc-400">12 x 8 x 6 in (1.8 lbs)</div>

                  <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">1x Cotton Classic Shirt</span>
                      <span className="font-semibold text-emerald-500">Fit OK</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">1x Leased Sneaker 42</span>
                      <span className="font-semibold text-emerald-500">Fit OK</span>
                    </div>
                  </div>
                </div>

                {/* Tracking Progress Flow */}
                <div
                  className={`p-4 rounded-xl border ${
                    isDarkMode ? "bg-zinc-950/60 border-zinc-800" : "bg-[#F8F9FB] border-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>Tracking Status</span>
                  </div>

                  <div className="space-y-3 pt-1 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">
                        ✓
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        Delivered
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 opacity-60">
                      <span className="w-3.5 h-3.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                      <span>Out for delivery</span>
                    </div>
                    <div className="flex items-center gap-2.5 opacity-60">
                      <span className="w-3.5 h-3.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                      <span>Departed Austin Depot</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barcode representation */}
              <div className="pt-2 flex flex-col items-center justify-center border-t border-zinc-200 dark:border-zinc-800">
                <div className="font-mono text-zinc-400 tracking-[0.3em] text-xs py-1">
                  ||||| | |||| ||| |||||| || | |||| |||
                </div>
                <div className="text-[10px] text-zinc-400 font-mono">
                  TRK: 9400 1118 9956 2200 4819 02
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
