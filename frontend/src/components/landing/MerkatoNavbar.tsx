import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Menu,
  X,
  FileText,
  Calendar,
  ExternalLink,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  HelpCircle,
  Code2,
  Users,
  ShieldCheck,
  User,
} from "lucide-react";
import { MerkatoLogo } from "../common/MerkatoLogo";
import {
  FEATURES_MEGA_MENU,
  SOLUTIONS_MEGA_MENU,
  INTEGRATIONS_MEGA_MENU,
  RESOURCES_MEGA_MENU,
} from "../../data/merkatoContent";

interface MerkatoNavbarProps {
  isDarkMode: boolean;
  onOpenSignUp?: () => void;
  onSignUpClick?: () => void;
  onOpenSignIn?: () => void;
  onOpenDemo?: () => void;
  onScheduleDemoClick?: () => void;
  onOpenWebinar?: () => void;
  onOpenTool?: (toolName: string) => void;
  onGoToDashboard?: () => void;
  onOpenDashboard?: () => void;
}

export const MerkatoNavbar: React.FC<MerkatoNavbarProps> = ({
  isDarkMode,
  onOpenSignUp,
  onSignUpClick,
  onOpenSignIn,
  onOpenDemo,
  onScheduleDemoClick,
  onOpenWebinar,
  onOpenTool,
  onGoToDashboard,
  onOpenDashboard,
}) => {
  const handleSignUp = onOpenSignUp || onSignUpClick || (() => {});
  const handleSignIn = onOpenSignIn || (() => {});
  const handleDemo = onOpenDemo || onScheduleDemoClick || (() => {});
  const handleDashboard = onGoToDashboard || onOpenDashboard || (() => {});
  const handleWebinar = onOpenWebinar || (() => {});
  const handleTool = onOpenTool || (() => {});

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (anchorId: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    const element = document.getElementById(anchorId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-30 w-full transition-all duration-300 relative ${
          isScrolled
            ? isDarkMode
              ? "bg-zinc-950/95 backdrop-blur-md shadow-md border-b border-zinc-800"
              : "bg-white/95 backdrop-blur-md shadow-sm border-b border-zinc-200/80"
            : isDarkMode
            ? "bg-[#181312] border-b border-zinc-800/80"
            : "bg-[#FDF0EA] border-b border-rose-100/60"
        }`}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
          {/* Logo: Authentic red cart + stacked Merkato Stock text */}
          <div className="flex items-center gap-8">
            <div
              className="cursor-pointer"
              onMouseEnter={() => setActiveDropdown(null)}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <MerkatoLogo isDark={isDarkMode} size="md" variant="product" />
            </div>

            {/* Desktop Nav Items */}
            <nav className="hidden lg:flex items-center space-x-1">
            {/* Features Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("features")}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === "features" ? null : "features")}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                  activeDropdown === "features"
                    ? "text-[#E42528]"
                    : isDarkMode
                    ? "text-zinc-200 hover:text-white"
                    : "text-zinc-700 hover:text-zinc-950"
                }`}
              >
                <span>Features</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    activeDropdown === "features" ? "rotate-180 text-[#E42528]" : ""
                  }`}
                />
              </button>
            </div>

            {/* Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("solutions")}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === "solutions" ? null : "solutions")}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                  activeDropdown === "solutions"
                    ? "text-[#E42528]"
                    : isDarkMode
                    ? "text-zinc-200 hover:text-white"
                    : "text-zinc-700 hover:text-zinc-950"
                }`}
              >
                <span>Solutions</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    activeDropdown === "solutions" ? "rotate-180 text-[#E42528]" : ""
                  }`}
                />
              </button>

              {activeDropdown === "solutions" && (
                <div
                  className="absolute left-0 top-full pt-1.5 w-[560px] z-50 animate-in fade-in-50 duration-150"
                >
                  <div
                    className={`p-6 shadow-xl border rounded-xl ${
                      isDarkMode
                        ? "bg-zinc-900 border-zinc-800 text-zinc-200"
                        : "bg-white border-zinc-200 text-zinc-800"
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-8">
                      {/* Industry */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-3 border-b pb-1">
                          By Industry
                        </h4>
                        <div className="space-y-3">
                          {SOLUTIONS_MEGA_MENU.industries.map((ind) => (
                            <div
                              key={ind.title}
                              onClick={() => handleNavClick("feature-pillars")}
                              className="group cursor-pointer"
                            >
                              <div className="text-xs font-bold group-hover:text-red-500 transition-colors">
                                {ind.title}
                              </div>
                              <div className="text-[11px] text-zinc-400 dark:text-zinc-500">
                                {ind.subtitle}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Use Cases */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-3 border-b pb-1">
                          Use Cases
                        </h4>
                        <div className="space-y-3">
                          {SOLUTIONS_MEGA_MENU.useCases.map((uc) => (
                            <div
                              key={uc.title}
                              onClick={() => handleNavClick("at-your-fingertips")}
                              className="group cursor-pointer"
                            >
                              <div className="text-xs font-bold group-hover:text-red-500 transition-colors">
                                {uc.title}
                              </div>
                              <div className="text-[11px] text-zinc-400 dark:text-zinc-500">
                                {uc.subtitle}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing */}
            <button
              onMouseEnter={() => setActiveDropdown(null)}
              onClick={() => handleNavClick("pricing")}
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                isDarkMode ? "text-zinc-200 hover:text-white" : "text-zinc-700 hover:text-zinc-950"
              }`}
            >
              Pricing
            </button>

            {/* Customers */}
            <button
              onMouseEnter={() => setActiveDropdown(null)}
              onClick={() => handleNavClick("testimonials")}
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                isDarkMode ? "text-zinc-200 hover:text-white" : "text-zinc-700 hover:text-zinc-950"
              }`}
            >
              Customers
            </button>

            {/* Integrations Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("integrations")}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === "integrations" ? null : "integrations")}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                  activeDropdown === "integrations"
                    ? "text-[#E42528]"
                    : isDarkMode
                    ? "text-zinc-200 hover:text-white"
                    : "text-zinc-700 hover:text-zinc-950"
                }`}
              >
                <span>Integrations</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    activeDropdown === "integrations" ? "rotate-180 text-[#E42528]" : ""
                  }`}
                />
              </button>

              {activeDropdown === "integrations" && (
                <div
                  className="absolute left-0 top-full pt-1.5 w-[480px] z-50 animate-in fade-in-50 duration-150"
                >
                  <div
                    className={`p-6 shadow-xl border rounded-xl ${
                      isDarkMode
                        ? "bg-zinc-900 border-zinc-800 text-zinc-200"
                        : "bg-white border-zinc-200 text-zinc-800"
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-3 border-b pb-1">
                          Marketplace
                        </h4>
                        <div className="grid grid-cols-1 gap-1.5">
                          {INTEGRATIONS_MEGA_MENU.categories.map((cat) => (
                            <div
                              key={cat}
                              onClick={() => handleNavClick("integrations")}
                              className="text-xs py-1 hover:text-red-500 cursor-pointer font-medium transition-colors"
                            >
                              {cat}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div
                        className={`p-4 rounded-lg border flex flex-col justify-between ${
                          isDarkMode ? "bg-zinc-950/70 border-zinc-800" : "bg-zinc-50 border-zinc-200"
                        }`}
                      >
                        <div>
                          <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">
                            Spotlight
                          </span>
                          <h4 className="text-sm font-bold mt-1 mb-1">
                            {INTEGRATIONS_MEGA_MENU.spotlight.name}
                          </h4>
                          <p className="text-xs text-zinc-500 leading-snug">
                            {INTEGRATIONS_MEGA_MENU.spotlight.description}
                          </p>
                        </div>

                        <button
                          onClick={() => handleNavClick("integrations")}
                          className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 pt-3"
                        >
                          <span>View all integrations</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("resources")}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === "resources" ? null : "resources")}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                  activeDropdown === "resources"
                    ? "text-[#E42528]"
                    : isDarkMode
                    ? "text-zinc-200 hover:text-white"
                    : "text-zinc-700 hover:text-zinc-950"
                }`}
              >
                <span>Resources</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    activeDropdown === "resources" ? "rotate-180 text-[#E42528]" : ""
                  }`}
                />
              </button>

              {activeDropdown === "resources" && (
                <div
                  className="absolute right-0 top-full pt-1.5 w-[560px] z-50 animate-in fade-in-50 duration-150"
                >
                  <div
                    className={`p-6 shadow-xl border rounded-xl ${
                      isDarkMode
                        ? "bg-zinc-900 border-zinc-800 text-zinc-200"
                        : "bg-white border-zinc-200 text-zinc-800"
                    }`}
                  >
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-3 border-b pb-1">
                          Connect
                        </h4>
                        <ul className="space-y-2">
                          {RESOURCES_MEGA_MENU.connect.map((item) => (
                            <li
                              key={item.title}
                              onClick={() => {
                                if (item.title === "Webinars") onOpenWebinar();
                                else onOpenDemo();
                                setActiveDropdown(null);
                              }}
                              className="group cursor-pointer"
                            >
                              <div className="text-xs font-bold group-hover:text-red-500 transition-colors">
                                {item.title}
                              </div>
                              <div className="text-[10px] text-zinc-400">{item.desc}</div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-3 border-b pb-1">
                          Learn
                        </h4>
                        <ul className="space-y-2">
                          {RESOURCES_MEGA_MENU.learn.map((item) => (
                            <li
                              key={item.title}
                              onClick={() => {
                                if (item.title === "Free tools") onOpenTool("Barcode Generator");
                                setActiveDropdown(null);
                              }}
                              className="group cursor-pointer"
                            >
                              <div className="text-xs font-bold group-hover:text-red-500 transition-colors">
                                {item.title}
                              </div>
                              <div className="text-[10px] text-zinc-400">{item.desc}</div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div
                        className={`p-4 rounded-lg border flex flex-col justify-between ${
                          isDarkMode ? "bg-zinc-950/70 border-zinc-800" : "bg-zinc-50 border-zinc-200"
                        }`}
                      >
                        <div>
                          <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider">
                            Featured Guide
                          </span>
                          <h4 className="text-xs font-bold mt-1 mb-2">
                            {RESOURCES_MEGA_MENU.featuredGuide.title}
                          </h4>
                        </div>
                        <button
                          onClick={onOpenWebinar}
                          className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <span>{RESOURCES_MEGA_MENU.featuredGuide.action}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Action buttons (Desktop) */}
        <div
          onMouseEnter={() => setActiveDropdown(null)}
          className="hidden lg:flex items-center gap-4"
        >
          <button
            onClick={handleDashboard}
            className={`px-3.5 py-2 text-sm font-semibold rounded-md border transition-all ${
              isDarkMode
                ? "border-zinc-700 text-zinc-200 hover:bg-zinc-800"
                : "border-zinc-300 text-zinc-800 hover:bg-zinc-50"
            }`}
          >
            Go to Dashboard
          </button>

          <button
            onClick={handleSignUp}
            className="bg-[#E42528] hover:bg-[#c91d20] text-white px-5 py-2.5 rounded font-bold text-sm tracking-wide uppercase transition-all shadow-sm transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Sign Up Now
          </button>
        </div>

        {/* Mobile top-right: User Profile Avatar Icon as shown in official screenshots */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={handleSignIn}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode
                ? "text-zinc-200 hover:bg-zinc-800"
                : "text-zinc-800 hover:bg-rose-50"
            }`}
            aria-label="User Account"
            title="User Account"
          >
            <User className="w-6 h-6 stroke-[1.6]" />
          </button>
        </div>
      </div>

      {/* Features Mega Menu (Direct child of relative header, seamlessly positions at top-full) */}
      {activeDropdown === "features" && (
        <div
          className={`absolute left-0 right-0 top-full w-full shadow-2xl border-b animate-in fade-in-50 duration-150 z-50 ${
            isDarkMode
              ? "bg-zinc-900 border-zinc-800 text-zinc-200"
              : "bg-white border-zinc-200 text-zinc-800"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-12 gap-8">
              {/* 6 Category Columns */}
              <div className="col-span-9 grid grid-cols-3 gap-6">
                {FEATURES_MEGA_MENU.columns.map((col) => (
                  <div key={col.heading} className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 border-b border-red-500/20 pb-1.5 flex items-center justify-between">
                      <span>{col.heading}</span>
                    </h4>
                    <ul className="space-y-2.5">
                      {col.items.map((item) => (
                        <li key={item.title} className="group cursor-pointer">
                          <div
                            onClick={() => handleNavClick("software-preview")}
                            className="text-xs font-semibold group-hover:text-red-500 transition-colors"
                          >
                            {item.title}
                          </div>
                          {item.description && (
                            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 line-clamp-1 group-hover:text-zinc-500 dark:group-hover:text-zinc-400">
                              {item.description}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Features Sidebar / PDF download / Demo */}
              <div
                className={`col-span-3 p-5 rounded-xl border flex flex-col justify-between ${
                  isDarkMode
                    ? "bg-zinc-950/60 border-zinc-800"
                    : "bg-zinc-50 border-zinc-200"
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center mb-4">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold mb-2">
                    {FEATURES_MEGA_MENU.sidebar.title}
                  </h4>
                  <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                    {FEATURES_MEGA_MENU.sidebar.description}
                  </p>
                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      onOpenTool("PDF Brochure");
                    }}
                    className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5"
                  >
                    <span>{FEATURES_MEGA_MENU.sidebar.actionText}</span>
                  </button>
                </div>

                <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 mt-6">
                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      onOpenDemo();
                    }}
                    className="w-full py-2.5 px-3 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold text-xs transition-all text-center flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Request a Demo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer (Toggled from bottom action bar or menu) */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden px-6 pt-3 pb-8 border-b animate-in slide-in-from-top-4 duration-200 shadow-xl ${
            isDarkMode ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"
          }`}
        >
          <div className="space-y-3 py-2">
            <button
              onClick={() => handleNavClick("software-preview")}
              className="block w-full text-left py-2.5 font-semibold text-base border-b border-zinc-100 dark:border-zinc-800"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick("feature-pillars")}
              className="block w-full text-left py-2.5 font-semibold text-base border-b border-zinc-100 dark:border-zinc-800"
            >
              Solutions
            </button>
            <button
              onClick={() => handleNavClick("pricing")}
              className="block w-full text-left py-2.5 font-semibold text-base border-b border-zinc-100 dark:border-zinc-800"
            >
              Pricing
            </button>
            <button
              onClick={() => handleNavClick("testimonials")}
              className="block w-full text-left py-2.5 font-semibold text-base border-b border-zinc-100 dark:border-zinc-800"
            >
              Customers
            </button>
            <button
              onClick={() => handleNavClick("integrations")}
              className="block w-full text-left py-2.5 font-semibold text-base border-b border-zinc-100 dark:border-zinc-800"
            >
              Integrations
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleDemo();
              }}
              className="block w-full text-left py-2.5 font-semibold text-base border-b border-zinc-100 dark:border-zinc-800"
            >
              Request a Demo
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleDashboard();
              }}
              className="block w-full text-left py-2.5 font-semibold text-base border-b border-zinc-100 dark:border-zinc-800 text-[#E42528]"
            >
              Open Inventory App Dashboard
            </button>

            <div className="pt-4 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignUp();
                }}
                className="w-full py-3 bg-[#E42528] text-white font-extrabold rounded text-center uppercase text-sm tracking-wider"
              >
                Sign Up For Free
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignIn();
                }}
                className="w-full py-2.5 border border-zinc-300 dark:border-zinc-700 font-bold rounded text-center text-sm"
              >
                Sign In to Account
              </button>
            </div>
          </div>
        </div>
      )}
    </header>

    {/* Mobile Fixed Bottom Action Bar (Identical to official Merkato Stock mobile experience) */}
    <aside
      aria-label="Mobile quick actions"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex h-14 bg-white dark:bg-zinc-900 border-t border-zinc-300 dark:border-zinc-800 shadow-[0_-4px_16px_rgba(0,0,0,0.12)]"
    >
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="w-16 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors border-r border-zinc-200 dark:border-zinc-700 cursor-pointer"
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? <X className="w-6 h-6 text-zinc-900 dark:text-white" /> : <Menu className="w-6 h-6 text-zinc-800 dark:text-zinc-200" />}
      </button>

      <button
        onClick={handleSignUp}
        className="flex-1 bg-[#E42528] hover:bg-[#c91d20] active:bg-[#a81619] text-white font-extrabold text-sm sm:text-base tracking-wider uppercase flex items-center justify-center transition-colors cursor-pointer"
      >
        SIGN UP FOR FREE
      </button>
    </aside>
  </>
  );
};
