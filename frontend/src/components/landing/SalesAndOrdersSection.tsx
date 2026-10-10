import React, { useState } from "react";
import { CheckCircle, Globe, CreditCard, BarChart2, RefreshCw, ShoppingCart, ArrowRight } from "lucide-react";

interface SalesAndOrdersSectionProps {
  isDarkMode: boolean;
  onExploreFeature: (feature: string) => void;
}

export const SalesAndOrdersSection: React.FC<SalesAndOrdersSectionProps> = ({
  isDarkMode,
  onExploreFeature,
}) => {
  const [selectedFeature, setSelectedFeature] = useState(0);

  const features = [
    {
      title: "Integrate multiple sales channels",
      desc: "Connect Shopify, Amazon, Etsy, and eBay so your orders flow automatically into a centralized fulfillment engine.",
      icon: ShoppingCart,
    },
    {
      title: "Sync stock effortlessly",
      desc: "Prevent overselling with real-time bidirectional inventory adjustments across all web storefronts instantly.",
      icon: RefreshCw,
    },
    {
      title: "Handle multiple currencies",
      desc: "Sell globally with live daily exchange rate conversions and multi-country tax compliance rules.",
      icon: Globe,
    },
    {
      title: "Get paid online",
      desc: "Send instant payment links and customer portal invoices through Stripe, PayPal, and credit card gateways.",
      icon: CreditCard,
    },
    {
      title: "Measure channel performance",
      desc: "Identify top-performing stores, peak sales hours, and best-margin product categories with detailed analytics.",
      icon: BarChart2,
    },
  ];

  return (
    <section
      className={`py-20 border-b transition-colors duration-200 ${
        isDarkMode
          ? "bg-zinc-950 border-zinc-800 text-white"
          : "bg-white border-zinc-100 text-zinc-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Simulated Order Cards UI */}
          <div className="lg:col-span-6">
            <div
              className={`p-6 sm:p-8 rounded-2xl border shadow-xl ${
                isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-[#F9FBFC] border-zinc-200"
              }`}
            >
              <div className="flex items-center justify-between border-b pb-4 mb-5 border-zinc-200 dark:border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Recent Sales Pipeline
                </span>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Syncing
                </span>
              </div>

              {/* Order Row 1: SO-00491 */}
              <div
                className={`p-4 rounded-xl border mb-3 flex items-center justify-between transition-all ${
                  isDarkMode ? "bg-zinc-950/60 border-zinc-800" : "bg-white border-zinc-200 shadow-2xs"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold text-xs flex items-center justify-center">
                    #
                  </div>
                  <div>
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      # SO-00491
                    </div>
                    <div className="text-sm font-semibold">Global Distribution</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    Confirmed
                  </span>
                  <div className="text-xs font-bold mt-1">$1,420.00</div>
                </div>
              </div>

              {/* Order Row 2: David Hill SO-00373 */}
              <div
                className={`p-4 rounded-xl border mb-3 flex items-center justify-between transition-all ${
                  isDarkMode ? "bg-zinc-950/60 border-zinc-800" : "bg-white border-zinc-200 shadow-2xs"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 font-bold text-xs flex items-center justify-center">
                    DH
                  </div>
                  <div>
                    <div className="text-sm font-bold">David Hill</div>
                    <div className="text-xs text-zinc-400">SO-00373 • Amazon Store</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-zinc-900 dark:text-white">
                    £396.00
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    Paid
                  </span>
                </div>
              </div>

              {/* Order Row 3: Ben Clark SO-00212 */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  isDarkMode ? "bg-zinc-950/60 border-zinc-800" : "bg-white border-zinc-200 shadow-2xs"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 font-bold text-xs flex items-center justify-center">
                    BC
                  </div>
                  <div>
                    <div className="text-sm font-bold">Ben Clark</div>
                    <div className="text-xs text-zinc-400">SO-00212 • Direct Web</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-zinc-900 dark:text-white">
                    €55.13
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Confirmed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Features List */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#E42528]">
              YOUR ORDERS AT ONE PLACE
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Everything you need from sales to shipping
            </h2>

            <div className="space-y-4 pt-2">
              {features.map((f, index) => {
                const Icon = f.icon;
                const isSelected = selectedFeature === index;
                return (
                  <div
                    key={f.title}
                    onClick={() => setSelectedFeature(index)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? isDarkMode
                          ? "bg-zinc-900 border-red-500/50 shadow-md"
                          : "bg-red-50/50 border-red-200 shadow-xs"
                        : isDarkMode
                        ? "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                        : "bg-white border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected ? "bg-[#E42528] text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4
                          className={`text-base font-bold mb-1 ${
                            isSelected ? "text-red-600 dark:text-red-400" : ""
                          }`}
                        >
                          {f.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                          {f.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onExploreFeature(features[selectedFeature].title)}
              className="flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors pt-2 cursor-pointer"
            >
              <span>Learn More about {features[selectedFeature].title}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
