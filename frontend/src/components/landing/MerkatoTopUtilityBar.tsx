import React, { useState } from "react";
import { Globe, ChevronDown, Moon, Sun, LayoutDashboard, Search } from "lucide-react";
import { MerkatoLogo } from "../common/MerkatoLogo";

interface MerkatoTopUtilityBarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSignIn: () => void;
  onOpenSignUp: () => void;
  onGoToDashboard: () => void;
}

export const MerkatoTopUtilityBar: React.FC<MerkatoTopUtilityBarProps> = ({
  isDarkMode,
  onToggleDarkMode,
  onOpenSignIn,
  onOpenSignUp,
  onGoToDashboard,
}) => {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

  const apps = [
    { name: "Books", url: "#" },
    { name: "Procurement", url: "#" },
    { name: "Billing", url: "#" },
    { name: "CRM", url: "#" },
  ];

  const allProductsList = [
    { title: "Finance & Operations", items: ["MERKATO STOCK", "Merkato Books", "Merkato Invoice", "Merkato Expense", "Merkato Checkout"] },
    { title: "Sales & Marketing", items: ["Merkato CRM", "Merkato Campaigns", "Merkato Social", "Merkato Forms", "Merkato SalesIQ"] },
    { title: "Productivity & IT", items: ["Merkato Mail", "Merkato Cliq", "Merkato Projects", "Merkato Analytics", "Merkato Creator"] },
  ];

  const languages = ["English", "Español", "Français", "Deutsch", "Português", "Italiano", "日本語"];

  return (
    <div
      className={`hidden lg:block w-full border-b text-xs transition-colors duration-200 z-40 relative ${
        isDarkMode
          ? "bg-zinc-950 border-zinc-800 text-zinc-300"
          : "bg-[#F8F9FA] border-zinc-200 text-zinc-600"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between">
        {/* Left: Merkato logo & sibling apps */}
        <div className="flex items-center gap-4 sm:gap-6">
          <MerkatoLogo size="sm" showProduct={false} isDark={isDarkMode} variant="corporate" />
          
          <nav className="hidden md:flex items-center gap-4">
            {apps.map((app) => (
              <a
                key={app.name}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                }}
                className={`hover:text-red-500 transition-colors ${
                  isDarkMode ? "hover:text-red-400" : "hover:text-red-600"
                }`}
              >
                {app.name}
              </a>
            ))}

            {/* All Products Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowAllProducts(true)}
              onMouseLeave={() => setShowAllProducts(false)}
            >
              <button
                onClick={() => setShowAllProducts(!showAllProducts)}
                className="flex items-center gap-1 hover:text-red-500 transition-colors font-medium py-1"
              >
                <span>All Products</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllProducts ? "rotate-180" : ""}`} />
              </button>

              {showAllProducts && (
                <div
                  className="absolute left-0 top-full pt-1.5 w-80 z-50 animate-in fade-in-50 zoom-in-95"
                >
                  <div
                    className={`p-4 rounded-lg shadow-xl border ${
                      isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-200" : "bg-white border-zinc-200 text-zinc-800"
                    }`}
                  >
                    <div className="space-y-4">
                      {allProductsList.map((col) => (
                        <div key={col.title}>
                          <div className="font-semibold text-red-500 text-[11px] uppercase tracking-wider mb-1.5">
                            {col.title}
                          </div>
                          <div className="grid grid-cols-2 gap-1 text-[11px]">
                            {col.items.map((prod) => (
                              <span
                                key={prod}
                                className={`cursor-pointer py-0.5 hover:text-red-500 transition-colors ${
                                  prod === "MERKATO STOCK" ? "font-bold text-red-600 dark:text-red-400" : ""
                                }`}
                              >
                                {prod}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right side: Language, Theme toggle, Dashboard switch, Sign In / Sign Up */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Quick interactive dashboard trigger */}
          <button
            onClick={onGoToDashboard}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded font-semibold text-[11px] transition-all ${
              isDarkMode
                ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700"
                : "bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-300 shadow-xs"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-red-500" />
            <span>Live App Dashboard</span>
          </button>

          {/* Dark mode switch */}
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            className={`p-1.5 rounded-full transition-colors ${
              isDarkMode ? "hover:bg-zinc-800 text-yellow-400" : "hover:bg-zinc-200 text-zinc-600"
            }`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Language selector */}
          <div
            className="relative hidden sm:block"
            onMouseEnter={() => setShowLangMenu(true)}
            onMouseLeave={() => setShowLangMenu(false)}
          >
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 hover:text-red-500 transition-colors py-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{selectedLang}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showLangMenu && (
              <div
                className="absolute right-0 top-full pt-1.5 w-32 z-50"
              >
                <div
                  className={`py-1.5 rounded shadow-lg border ${
                    isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-200" : "bg-white border-zinc-200 text-zinc-800"
                  }`}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLang(lang);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1 text-[11px] hover:bg-red-500 hover:text-white transition-colors ${
                        lang === selectedLang ? "font-bold text-red-500" : ""
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sign In link */}
          <button
            onClick={onOpenSignIn}
            className="hover:text-red-500 font-medium transition-colors cursor-pointer"
          >
            Sign In
          </button>

          {/* Top red Sign Up button */}
          <button
            onClick={onOpenSignUp}
            className="bg-[#E42528] hover:bg-[#c91d20] text-white px-3 py-1 rounded font-bold text-[11px] tracking-wide uppercase transition-all shadow-xs"
          >
            Sign Up Now
          </button>
        </div>
      </div>
    </div>
  );
};
