import React, { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { PRICING_PLANS } from "../../data/merkatoContent";

interface PricingSectionProps {
  isDarkMode: boolean;
  onSelectPlan: (planName: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  isDarkMode,
  onSelectPlan,
}) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  return (
    <section
      id="pricing"
      className={`py-20 border-b transition-colors duration-200 ${
        isDarkMode
          ? "bg-zinc-950 border-zinc-800 text-white"
          : "bg-[#FAFAFA] border-zinc-200 text-zinc-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#E42528] mb-3">
            GET STARTED
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Simple pricing. No surprises.
          </h2>
          <p className="text-base text-zinc-500 dark:text-zinc-400">
            Choose a plan tailored to your order volume. Scale effortlessly as your business expands.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 rounded-full border mt-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-xs">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              MONTHLY
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === "yearly"
                  ? "bg-[#E42528] text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <span>YEARLY</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full uppercase">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const price = billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
            const isPopular = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`p-6 rounded-2xl border flex flex-col justify-between transition-all relative ${
                  isPopular
                    ? isDarkMode
                      ? "bg-zinc-900 border-red-500 shadow-xl shadow-red-950/30 ring-1 ring-red-500"
                      : "bg-white border-[#E42528] shadow-xl shadow-red-100 ring-2 ring-[#E42528]"
                    : isDarkMode
                    ? "bg-zinc-900/70 border-zinc-800 hover:border-zinc-700"
                    : "bg-white border-zinc-200 hover:border-zinc-300 shadow-2xs"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#E42528] text-white text-[10px] font-black uppercase tracking-wider py-0.5 px-3 rounded-full shadow-xs">
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-black tracking-tight mb-1">{plan.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 min-h-[36px] leading-relaxed mb-4">
                    {plan.description}
                  </p>

                  <div className="mb-5 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black">${price}</span>
                      <span className="text-xs text-zinc-400 font-medium">/ month</span>
                    </div>
                    {billingCycle === "yearly" && price > 0 && (
                      <div className="text-[10px] text-emerald-500 font-semibold mt-0.5">
                        Billed annually (${price * 12}/yr)
                      </div>
                    )}
                  </div>

                  {/* Volume quotas */}
                  <div className="space-y-1.5 text-xs font-semibold mb-6">
                    <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-800/60 flex justify-between">
                      <span className="text-zinc-500">Orders:</span>
                      <span className="text-zinc-900 dark:text-zinc-100">{plan.ordersLimit}</span>
                    </div>
                    <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-800/60 flex justify-between">
                      <span className="text-zinc-500">Warehouses:</span>
                      <span className="text-zinc-900 dark:text-zinc-100">{plan.warehousesLimit}</span>
                    </div>
                    <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-800/60 flex justify-between">
                      <span className="text-zinc-500">Users:</span>
                      <span className="text-zinc-900 dark:text-zinc-100">{plan.usersLimit}</span>
                    </div>
                  </div>

                  {/* Feature bullets */}
                  <div className="space-y-2 mb-6">
                    <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      Included:
                    </div>
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2 text-xs leading-snug">
                        <Check className="w-3.5 h-3.5 text-[#E42528] shrink-0 mt-0.5" />
                        <span className="text-zinc-600 dark:text-zinc-300">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onSelectPlan(plan.name)}
                  className={`w-full py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    isPopular
                      ? "bg-[#E42528] hover:bg-[#c91d20] text-white shadow-md shadow-red-500/20"
                      : isDarkMode
                      ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-900"
                  }`}
                >
                  {plan.monthlyPrice === 0 ? "Sign Up Free" : "Start Free Trial"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Enterprise footnote */}
        <div className="mt-12 text-center text-xs text-zinc-400">
          Need higher volume than 15,000 monthly orders or dedicated on-premise multi-tenant setups?{" "}
          <button
            onClick={() => onSelectPlan("Enterprise Custom")}
            className="text-red-500 font-bold hover:underline"
          >
            Contact our Solutions Team
          </button>
        </div>
      </div>
    </section>
  );
};
