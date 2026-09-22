import React from "react";
import { Smartphone, ArrowRight, Download, Apple, Play } from "lucide-react";

interface MobileAppsSectionProps {
  isDarkMode: boolean;
}

export const MobileAppsSection: React.FC<MobileAppsSectionProps> = ({ isDarkMode }) => {
  return (
    <section
      id="mobile-apps"
      className={`py-20 border-b transition-colors duration-200 overflow-hidden ${
        isDarkMode
          ? "bg-zinc-950 border-zinc-800 text-white"
          : "bg-white border-zinc-100 text-zinc-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & Store Buttons */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#E42528]">
              WITH YOU EVERYWHERE
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-tight">
              Inventory apps to close deals on the go
            </h2>

            <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Carry your warehouse wherever you travel. Check stock availability, scan items using
              your device camera, create purchase receipts, and track shipments in real time.
            </p>

            {/* Store Download Badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              {/* App Store badge */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-2.5 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-zinc-800 transition-colors border border-zinc-700 shadow-sm"
              >
                <Apple className="w-5 h-5 fill-current" />
                <div className="text-left leading-tight">
                  <div className="text-[9px] uppercase tracking-wider text-zinc-400">Download on the</div>
                  <div className="text-xs font-bold">App Store</div>
                </div>
              </a>

              {/* Google Play badge */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-2.5 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-zinc-800 transition-colors border border-zinc-700 shadow-sm"
              >
                <Play className="w-4 h-4 fill-current text-emerald-400" />
                <div className="text-left leading-tight">
                  <div className="text-[9px] uppercase tracking-wider text-zinc-400">GET IT ON</div>
                  <div className="text-xs font-bold">Google Play</div>
                </div>
              </a>

              {/* Windows store badge */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-2.5 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-zinc-800 transition-colors border border-zinc-700 shadow-sm"
              >
                <span className="text-xs font-black text-blue-400">❖</span>
                <div className="text-left leading-tight">
                  <div className="text-[9px] uppercase tracking-wider text-zinc-400">Get it from</div>
                  <div className="text-xs font-bold">Microsoft</div>
                </div>
              </a>
            </div>

            <div className="pt-2">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#E42528] hover:text-red-700"
              >
                <span>Check out our mobile apps</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Angled Tablet / Phone mockup */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-md">
              {/* Tablet screen container */}
              <div
                className={`p-3 rounded-[32px] border-4 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 ${
                  isDarkMode
                    ? "bg-zinc-900 border-zinc-700 shadow-black"
                    : "bg-zinc-900 border-zinc-800 shadow-2xl"
                }`}
              >
                {/* Screen bezel */}
                <div className="rounded-[24px] bg-[#1F2430] p-4 text-white overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-3 mb-4">
                    <span className="font-bold text-white">MERKATO STOCK Mobile</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                      Connected
                    </span>
                  </div>

                  {/* Summary row */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-zinc-800/80 p-3 rounded-xl">
                      <div className="text-[10px] text-zinc-400 uppercase font-bold">Packed Today</div>
                      <div className="text-xl font-black text-red-400">4,130</div>
                    </div>
                    <div className="bg-zinc-800/80 p-3 rounded-xl">
                      <div className="text-[10px] text-zinc-400 uppercase font-bold">In Transit</div>
                      <div className="text-xl font-black text-blue-400">2,340</div>
                    </div>
                  </div>

                  {/* Item scan feed */}
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-zinc-800/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="font-medium">SHIRT-NVY-L</span>
                      </div>
                      <span className="text-zinc-400 font-mono">Qty: 240</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-zinc-800/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="font-medium">SNK-LS-42</span>
                      </div>
                      <span className="text-amber-400 font-mono font-bold">Low: 18 left</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
