import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Play,
  Package,
  Truck,
  FileCheck,
  Receipt,
  Search,
  Bell,
  AlertTriangle,
  Flame,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Layers,
  ArrowUpRight,
} from "lucide-react";

interface SoftwarePreviewSectionProps {
  isDarkMode: boolean;
  onExploreDemo?: () => void;
  onPlayVideoTour?: () => void;
  onOpenFullDashboard?: () => void;
}

export const SoftwarePreviewSection: React.FC<SoftwarePreviewSectionProps> = ({
  isDarkMode,
  onExploreDemo,
  onPlayVideoTour,
  onOpenFullDashboard,
}) => {
  const handleLaunch = onOpenFullDashboard || onExploreDemo || (() => {});
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "stock">("dashboard");

  return (
    <section
      id="software-preview"
      className={`py-20 border-b transition-colors duration-200 relative overflow-hidden ${
        isDarkMode
          ? "bg-zinc-950 border-zinc-800 text-white"
          : "bg-[#FAFAFA] border-zinc-200 text-zinc-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#E42528] mb-3">
            ENGINEERED FOR GROWTH
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Meet your next-gen inventory software
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
            A single, connected hub for multi-channel sales, warehouse stock control, and automated carrier fulfillment.
          </p>

          {/* Interactive Mode Tabs */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-[#E42528] text-white shadow-sm"
                  : isDarkMode
                  ? "bg-zinc-900 text-zinc-400 hover:text-white"
                  : "bg-white text-zinc-600 hover:text-black border border-zinc-200"
              }`}
            >
              Executive Console
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === "orders"
                  ? "bg-[#E42528] text-white shadow-sm"
                  : isDarkMode
                  ? "bg-zinc-900 text-zinc-400 hover:text-white"
                  : "bg-white text-zinc-600 hover:text-black border border-zinc-200"
              }`}
            >
              Order Pipeline
            </button>
            <button
              onClick={() => setActiveTab("stock")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === "stock"
                  ? "bg-[#E42528] text-white shadow-sm"
                  : isDarkMode
                  ? "bg-zinc-900 text-zinc-400 hover:text-white"
                  : "bg-white text-zinc-600 hover:text-black border border-zinc-200"
              }`}
            >
              Stock Reorder Alerts
            </button>
          </div>
        </div>

        {/* Realistic App UI Shell */}
        <div className="relative mx-auto max-w-6xl">
          {/* Main App Container */}
          <motion.div
            layout
            className={`rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300 ${
              isDarkMode
                ? "bg-zinc-900 border-zinc-700/80 shadow-black/80"
                : "bg-white border-zinc-200 shadow-zinc-300/40"
            }`}
          >
            {/* Window Top chrome / Navigation */}
            <div className="h-11 bg-zinc-900 text-zinc-400 px-4 flex items-center justify-between border-b border-zinc-800 text-xs select-none">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                </div>

                {/* Organization Switcher */}
                <div className="flex items-center gap-2 text-zinc-200 font-semibold text-[11px] sm:text-xs bg-zinc-800/80 px-2 sm:px-2.5 py-1 rounded truncate max-w-[140px] sm:max-w-none">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="truncate">MERKATO Global Distribution</span>
                </div>
              </div>

              {/* Search Bar in Chrome */}
              <div className="hidden sm:flex items-center gap-2 bg-zinc-800/60 text-zinc-400 px-3 py-1 rounded-md text-xs w-52 md:w-64">
                <Search className="w-3.5 h-3.5" />
                <span className="truncate">Search items, orders (/)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLaunch}
                  className="bg-[#E42528] hover:bg-[#c91d20] text-white text-[11px] font-bold px-2.5 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <span>Launch Live UI</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* App Layout: Left Sidebar + Right Content Area */}
            <div className="grid grid-cols-12 min-h-[460px]">
              {/* Left App Sidebar */}
              <div className="hidden md:block col-span-2 bg-[#1B1F2A] text-zinc-300 p-3 border-r border-zinc-800 text-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-2 mb-2">
                  Main
                </div>
                <div className="space-y-1">
                  <div
                    onClick={() => setActiveTab("dashboard")}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded font-medium cursor-pointer transition-colors ${
                      activeTab === "dashboard" ? "bg-red-600 text-white font-bold" : "hover:bg-zinc-800/80 text-zinc-300"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </div>
                  <div
                    onClick={() => setActiveTab("stock")}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded font-medium cursor-pointer transition-colors ${
                      activeTab === "stock" ? "bg-red-600 text-white font-bold" : "hover:bg-zinc-800/80 text-zinc-300"
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Inventory Items</span>
                  </div>
                  <div
                    onClick={() => setActiveTab("orders")}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded font-medium cursor-pointer transition-colors ${
                      activeTab === "orders" ? "bg-red-600 text-white font-bold" : "hover:bg-zinc-800/80 text-zinc-300"
                    }`}
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Sales Orders</span>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded text-zinc-400 hover:bg-zinc-800/80 cursor-pointer">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Packages</span>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded text-zinc-400 hover:bg-zinc-800/80 cursor-pointer">
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Invoices</span>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded text-zinc-400 hover:bg-zinc-800/80 cursor-pointer">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Integrations</span>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-800 text-[10px] text-zinc-500 px-2">
                  Connected Depots: 3
                </div>
              </div>

              {/* Right App Main Panel */}
              <div
                className={`col-span-12 md:col-span-10 p-5 sm:p-6 space-y-6 ${
                  isDarkMode ? "bg-zinc-950 text-white" : "bg-[#F7F9FC] text-zinc-900"
                }`}
              >
                {/* Top Sales Activity Row matching video exact numbers */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Sales Activity
                    </h3>
                    <span className="text-[11px] text-red-500 font-semibold cursor-pointer hover:underline" onClick={onExploreDemo}>
                      View full report &rarr;
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {/* 228 To be Packed */}
                    <div
                      className={`p-3.5 rounded-xl border transition-all ${
                        isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                        <span>Quantity to pack</span>
                        <Package className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                        228
                      </div>
                      <div className="text-[10px] text-zinc-400 font-medium">TO BE PACKED</div>
                    </div>

                    {/* 6 To be Shipped */}
                    <div
                      className={`p-3.5 rounded-xl border transition-all ${
                        isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                        <span>Quantity to ship</span>
                        <Truck className="w-3.5 h-3.5 text-red-500" />
                      </div>
                      <div className="text-2xl font-black text-red-600 dark:text-red-400">
                        6
                      </div>
                      <div className="text-[10px] text-zinc-400 font-medium">TO BE SHIPPED</div>
                    </div>

                    {/* 10 To be Delivered */}
                    <div
                      className={`p-3.5 rounded-xl border transition-all ${
                        isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                        <span>En route</span>
                        <FileCheck className="w-3.5 h-3.5 text-amber-500" />
                      </div>
                      <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                        10
                      </div>
                      <div className="text-[10px] text-zinc-400 font-medium">TO BE DELIVERED</div>
                    </div>

                    {/* 474 To be Invoiced */}
                    <div
                      className={`p-3.5 rounded-xl border transition-all ${
                        isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                        <span>Unbilled sales</span>
                        <Receipt className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        474
                      </div>
                      <div className="text-[10px] text-zinc-400 font-medium">TO BE INVOICED</div>
                    </div>
                  </div>
                </div>

                {/* Second Row: Purchase Order + Product Details + Top Selling Items */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Purchase Order widget */}
                  <div
                    className={`p-4 rounded-xl border ${
                      isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
                    }`}
                  >
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      Purchase Order
                    </div>
                    <div className="text-xl font-black text-zinc-800 dark:text-zinc-100">
                      $652.00
                    </div>
                    <div className="text-[11px] text-zinc-400 mb-3">Quantity Ordered</div>

                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px]">
                      <div className="flex justify-between py-0.5">
                        <span className="text-zinc-400">Direct sales:</span>
                        <span className="font-bold text-emerald-600">50 confirmed</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-zinc-400">Channel sync:</span>
                        <span className="font-semibold text-blue-500">Shopify & Amazon</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Details widget */}
                  <div
                    className={`p-4 rounded-xl border ${
                      isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
                    }`}
                  >
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Product Details</span>
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-red-500 font-bold">
                        <span>Low Stock Items:</span>
                        <span>3</span>
                      </div>
                      <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                        <span>All Item Groups:</span>
                        <span>8</span>
                      </div>
                      <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                        <span>All Items:</span>
                        <span>190</span>
                      </div>
                      <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                        <span>Unconfirmed Items:</span>
                        <span>121</span>
                      </div>
                    </div>
                  </div>

                  {/* Top Selling Items widget */}
                  <div
                    className={`p-4 rounded-xl border ${
                      isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
                    }`}
                  >
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Top Selling Items</span>
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-600 dark:text-zinc-300">
                        👕
                      </div>
                      <div>
                        <div className="text-xs font-bold">Cotton Classic Shirt</div>
                        <div className="text-xs font-extrabold text-[#E42528]">171 pcs sold</div>
                        <div className="text-[10px] text-emerald-500 font-medium">Reorder safe (240 left)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Red Play Video Overlay Button with animated pulse */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <button
              onClick={onPlayVideoTour}
              aria-label="Play product demo tour"
              className="relative group cursor-pointer"
            >
              {/* Pulsing ring */}
              <span className="absolute -inset-3 rounded-full bg-red-600/30 animate-ping" />
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E42528] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
              </div>
            </button>
          </div>

          {/* Floating Companion Mobile App Mockup (as shown in video) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={`hidden xl:block absolute -bottom-10 -right-8 w-60 p-3 rounded-3xl border shadow-2xl backdrop-blur-xl z-20 ${
              isDarkMode
                ? "bg-zinc-900/95 border-zinc-700 text-white"
                : "bg-white/95 border-zinc-300 text-zinc-900"
            }`}
          >
            {/* Phone notch */}
            <div className="w-20 h-4 bg-zinc-800 rounded-full mx-auto mb-3" />
            <div className="px-2">
              <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold mb-2">
                <span>MOBILE SCANNER</span>
                <span className="text-emerald-500">ONLINE</span>
              </div>
              <div className="bg-red-500/10 dark:bg-red-950/40 border border-red-500/30 p-2 rounded-xl mb-3">
                <div className="text-[11px] font-bold text-red-600 dark:text-red-400">
                  Barcode Scanner Active
                </div>
                <div className="text-[10px] text-zinc-500">SHIRT-NVY-L detected</div>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-400">To Pack</span>
                  <span className="font-bold text-blue-500">228 pkgs</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-400">Dispatched</span>
                  <span className="font-bold text-emerald-500">1,653 done</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
