import React from "react";
import { motion } from "motion/react";
import { Package, Truck, CheckCircle2, ArrowRight, TrendingUp } from "lucide-react";

interface HeroSectionProps {
  isDarkMode: boolean;
  onSignUpClick?: () => void;
  onStartTrial?: () => void;
  onExploreDemoClick?: () => void;
  onOpenLiveDashboard?: () => void;
  onScheduleDemo?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  isDarkMode,
  onSignUpClick,
  onStartTrial,
  onExploreDemoClick,
  onOpenLiveDashboard,
  onScheduleDemo,
}) => {
  const handleSignUp = onSignUpClick || onStartTrial || (() => {});
  const handleDemo = onExploreDemoClick || onOpenLiveDashboard || onScheduleDemo || (() => {});

  return (
    <section
      className={`relative overflow-hidden pt-6 pb-16 sm:pt-10 sm:pb-20 lg:pt-16 lg:pb-24 transition-colors duration-300 ${
        isDarkMode
          ? "bg-[#181312] text-white"
          : "bg-[#FDF0EA] text-zinc-900"
      }`}
    >
      {/* Subtle background glow */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Column: Headline, Subtitle, App Badges, CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 space-y-5 sm:space-y-6 text-center lg:text-left"
          >
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.14]">
              Manage inventory <br />
              and fulfill orders - <br />
              <span className="text-[#E42528] font-black">
                the right way
              </span>
            </h1>

            <p
              className={`text-sm sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal ${
                isDarkMode ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Successful business relies on successful inventory management. Automate your
              inventory operations and sell more with less effort.
            </p>

            {/* Mobile-First Download Badges (App Store & Google Play - as in screenshots 1, 2, 3, 5) */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              {/* App Store Badge */}
              <a
                href="#mobile-apps"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("mobile-apps")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-black hover:bg-zinc-800 text-white px-3.5 py-2 rounded-lg flex items-center gap-2.5 transition-transform hover:scale-105 shadow-md"
              >
                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.66-.99 1.73-.87 2.76.99.08 1.99-.51 2.6-1.26z" />
                </svg>
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-zinc-400 font-medium leading-none">
                    Download on the
                  </div>
                  <div className="text-xs sm:text-sm font-bold leading-tight">
                    App Store
                  </div>
                </div>
              </a>

              {/* Google Play Badge */}
              <a
                href="#mobile-apps"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("mobile-apps")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-black hover:bg-zinc-800 text-white px-3.5 py-2 rounded-lg flex items-center gap-2.5 transition-transform hover:scale-105 shadow-md"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5.31 0 .61.1.86.28l13.5 8.5c.67.42.87 1.31.45 1.98-.12.19-.28.34-.45.45l-13.5 8.5c-.25.18-.55.28-.86.28-.83 0-1.5-.67-1.5-1.49z" />
                </svg>
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-zinc-400 font-medium leading-none">
                    GET IT ON
                  </div>
                  <div className="text-xs sm:text-sm font-bold leading-tight">
                    Google Play
                  </div>
                </div>
              </a>
            </div>

            {/* Desktop / Tablet CTA Buttons */}
            <div className="hidden sm:flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSignUp}
                className="w-full sm:w-auto bg-[#E42528] hover:bg-[#c91d20] text-white font-extrabold text-sm sm:text-base px-7 py-3.5 rounded tracking-wider uppercase shadow-md shadow-red-500/20 transition-all cursor-pointer"
              >
                SIGN UP - IT'S FREE
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDemo}
                className={`w-full sm:w-auto font-bold text-sm sm:text-base px-6 py-3.5 rounded tracking-wider uppercase border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isDarkMode
                    ? "border-zinc-700 hover:border-zinc-500 bg-zinc-900/90 text-white hover:bg-zinc-800"
                    : "border-zinc-300 hover:border-zinc-900 bg-white text-zinc-900 shadow-xs"
                }`}
              >
                <span>EXPLORE DEMO ACCOUNT</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-6 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Free 14-day trial
              </span>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual with Animated Floating Cards (Responsive for mobile & desktop) */}
          <div className="lg:col-span-6 relative flex items-center justify-center mt-6 lg:mt-0">
            <div className="relative w-full max-w-[340px] sm:max-w-md lg:max-w-lg mx-auto">
              {/* Backing decorative colored shape */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-amber-400/20 via-red-400/20 to-blue-400/20 transform rotate-1 scale-95 blur-md" />

              {/* Main Photo Container - Smiling professional on boxes with laptop */}
              <div
                className={`relative rounded-2xl overflow-hidden border shadow-xl ${
                  isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200/80"
                }`}
              >
                <img
                  src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&auto=format&fit=crop&q=80"
                  alt="Operations specialist managing warehouse inventory"
                  className="w-full h-[300px] sm:h-[400px] object-cover object-top opacity-95 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Badge 1: Sales Order SO-00198 (Top-Left) */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`absolute -top-4 -left-2 sm:-top-6 sm:-left-6 p-2.5 sm:p-3.5 rounded-xl shadow-xl border backdrop-blur-md z-20 w-44 sm:w-56 ${
                  isDarkMode
                    ? "bg-zinc-900/95 border-zinc-700 text-white shadow-black/50"
                    : "bg-white/95 border-zinc-200/90 text-zinc-900 shadow-zinc-400/30"
                }`}
              >
                <div className="flex items-center justify-between border-b pb-1.5 mb-1.5 border-zinc-200 dark:border-zinc-800">
                  <div className="text-[10px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    Sales Order
                  </div>
                  <div className="text-[11px] sm:text-xs font-extrabold text-blue-600 dark:text-blue-400">
                    SO-00198
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[10px] sm:text-[11px] text-center">
                  <div>
                    <div className="text-zinc-400 text-[9px]">Items</div>
                    <div className="font-bold text-[11px]">9</div>
                  </div>
                  <div>
                    <div className="text-zinc-400 text-[9px]">Qty</div>
                    <div className="font-bold text-[11px]">9</div>
                  </div>
                  <div>
                    <div className="text-zinc-400 text-[9px]">Status</div>
                    <div className="text-[8px] sm:text-[9px] font-bold px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Paid
                    </div>
                  </div>
                  <div>
                    <div className="text-zinc-400 text-[9px]">Total</div>
                    <div className="font-bold text-[11px] text-red-500">$275</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge 2: Total Sales (Top-Right) */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className={`absolute -top-5 -right-2 sm:-top-7 sm:-right-4 p-2.5 sm:p-3.5 rounded-xl shadow-xl border backdrop-blur-md z-20 flex items-center gap-2 sm:gap-3 ${
                  isDarkMode
                    ? "bg-zinc-900/95 border-zinc-700 text-white shadow-black/50"
                    : "bg-white/95 border-zinc-200/90 text-zinc-900 shadow-zinc-400/30"
                }`}
              >
                {/* Circular chart graphic */}
                <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center shrink-0">
                  <svg className="w-9 h-9 sm:w-11 sm:h-11 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-zinc-200 dark:text-zinc-800"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500"
                      strokeDasharray="75, 100"
                      strokeWidth="4"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600 absolute" />
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Total Sales
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 leading-tight">
                    $148,290
                  </div>
                  <div className="text-[9px] text-zinc-400">+24% vs last mo</div>
                </div>
              </motion.div>

              {/* Floating Badge 3: 4130 To be Packed (Bottom-Left Pill) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className={`absolute -bottom-3 -left-2 sm:-bottom-4 sm:-left-5 py-1.5 px-3 sm:py-2.5 sm:px-4 rounded-full shadow-lg border flex items-center gap-2 sm:gap-3 backdrop-blur-md z-20 ${
                  isDarkMode
                    ? "bg-zinc-900/95 border-zinc-700 text-white"
                    : "bg-white/95 border-zinc-200 text-zinc-900"
                }`}
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center font-bold shrink-0">
                  <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold leading-tight text-red-600 dark:text-red-400">
                    4,130
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 font-medium whitespace-nowrap">
                    To be Packed
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge 4: 2340 To be Shipped (Middle-Right) */}
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className={`absolute top-1/2 -right-2 sm:-right-6 py-1.5 px-2.5 sm:py-2 sm:px-3.5 rounded-full shadow-lg border flex items-center gap-2 backdrop-blur-md z-20 ${
                  isDarkMode
                    ? "bg-zinc-900/95 border-zinc-700 text-white"
                    : "bg-white/95 border-zinc-200 text-zinc-900"
                }`}
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold shrink-0">
                  <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-extrabold text-blue-600 dark:text-blue-400 leading-tight">
                    2,340
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 font-medium whitespace-nowrap">
                    To be Shipped
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge 5: 1653 To be Delivered (Bottom-Right Pill) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className={`absolute -bottom-5 right-2 sm:right-6 py-1.5 px-2.5 sm:py-2 sm:px-3.5 rounded-full shadow-lg border flex items-center gap-2 backdrop-blur-md z-20 ${
                  isDarkMode
                    ? "bg-zinc-900/95 border-zinc-700 text-white"
                    : "bg-white/95 border-zinc-200 text-zinc-900"
                }`}
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-extrabold text-amber-600 dark:text-amber-400 leading-tight">
                    1,653
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 font-medium whitespace-nowrap">
                    To be Delivered
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
