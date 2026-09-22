import React from "react";
import { ArrowRight, Boxes, TrendingUp, Warehouse } from "lucide-react";

interface FeaturePillarsProps {
  isDarkMode: boolean;
  onExploreFeature?: (featureName: string) => void;
}

export const FeaturePillars: React.FC<FeaturePillarsProps> = ({
  isDarkMode,
  onExploreFeature,
}) => {
  const pillars = [
    {
      title: "Sell more with assemblies",
      description:
        "Sort items, create appealing price offers, and manage your production line with item groups and composite assemblies.",
      icon: Boxes,
      iconColor: "text-amber-500",
      bgGradient: "from-amber-500/10 to-transparent",
      badge: "KITTING & ASSEMBLY",
    },
    {
      title: "Handle sales spikes",
      description:
        "From dropshipping to backordering, eliminate product shortages, maintain a healthy cash flow, and never lose out on a sale.",
      icon: TrendingUp,
      iconColor: "text-emerald-500",
      bgGradient: "from-emerald-500/10 to-transparent",
      badge: "DEMAND FORECASTING",
    },
    {
      title: "Control warehouses",
      description:
        "Manage your stock across multiple warehouse locations, transfer items within warehouses, and generate warehouse-specific reports.",
      icon: Warehouse,
      iconColor: "text-blue-500",
      bgGradient: "from-blue-500/10 to-transparent",
      badge: "MULTI-DEPOT TRACKING",
    },
  ];

  return (
    <section
      id="feature-pillars"
      className={`py-20 border-b transition-colors duration-200 ${
        isDarkMode
          ? "bg-zinc-950 border-zinc-800 text-white"
          : "bg-white border-zinc-100 text-zinc-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#E42528] mb-3">
            IT'S TIME TO START RIGHT
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Transform the way you manage your inventory
          </h2>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className={`p-8 rounded-2xl border transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 ${
                  isDarkMode
                    ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 shadow-lg"
                    : "bg-[#FAFAFA] border-zinc-200/90 hover:border-zinc-300 hover:bg-white shadow-sm"
                }`}
              >
                <div>
                  {/* Pillar Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white dark:bg-zinc-800 shadow-xs border border-zinc-200/60 dark:border-zinc-700/60 ${pillar.iconColor}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold tracking-tight mb-3 group-hover:text-red-500 transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                <button
                  onClick={() => onExploreFeature?.(pillar.title)}
                  className="flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 transition-colors pt-4 border-t border-zinc-200/60 dark:border-zinc-800 cursor-pointer"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
