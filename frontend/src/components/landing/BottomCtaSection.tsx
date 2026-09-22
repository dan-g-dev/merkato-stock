import React from "react";
import { CheckCircle2, Calendar, ArrowRight } from "lucide-react";

interface BottomCtaSectionProps {
  isDarkMode: boolean;
  onScheduleDemo: () => void;
  onStartTrial: () => void;
}

export const BottomCtaSection: React.FC<BottomCtaSectionProps> = ({
  isDarkMode,
  onScheduleDemo,
  onStartTrial,
}) => {
  return (
    <section
      className={`py-20 border-b text-center transition-colors duration-200 ${
        isDarkMode
          ? "bg-zinc-950 border-zinc-800 text-white"
          : "bg-white border-zinc-100 text-zinc-900"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-8">
          Start growing with <br className="hidden sm:inline" />
          MERKATO STOCK today
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            onClick={onScheduleDemo}
            className="w-full sm:w-auto bg-[#E42528] hover:bg-[#c91d20] text-white font-extrabold text-sm sm:text-base px-8 py-4 rounded-md uppercase tracking-wider transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
          >
            <Calendar className="w-5 h-5" />
            <span>SCHEDULE A DEMO</span>
          </button>

          <button
            onClick={onStartTrial}
            className={`w-full sm:w-auto font-bold text-sm sm:text-base px-8 py-4 rounded-md uppercase tracking-wider border transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isDarkMode
                ? "border-zinc-700 hover:border-zinc-500 bg-zinc-900 text-white"
                : "border-zinc-300 hover:border-zinc-800 bg-white text-zinc-900 shadow-xs"
            }`}
          >
            <span>START FREE TRIAL</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Trust points */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            14-day free trial.
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            No credit card required.
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Cancel anytime.
          </span>
        </div>
      </div>
    </section>
  );
};
