import React from "react";
import { Video, Calendar, Clock, ChevronRight } from "lucide-react";

interface WebinarBannerProps {
  onRegisterClick?: () => void;
  onRegister?: () => void;
  isDarkMode?: boolean;
}

export const WebinarBanner: React.FC<WebinarBannerProps> = ({
  onRegisterClick,
  onRegister,
  isDarkMode,
}) => {
  const handleRegister = onRegister || onRegisterClick || (() => {});
  return (
    <div className="w-full bg-[#18181B] text-white border-y border-zinc-800 py-3.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
        {/* Webinar title */}
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-7 h-7 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center shrink-0">
            <Video className="w-4 h-4" />
          </div>
          <span className="font-semibold tracking-wide text-zinc-100">
            Join our free live webinar to see MERKATO STOCK in action
          </span>
        </div>

        {/* Schedule & CTA */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          <div className="flex items-center gap-1.5 text-zinc-300 text-xs sm:text-sm">
            <Calendar className="w-4 h-4 text-red-400" />
            <span className="font-medium">Every Weekday</span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-300 text-xs sm:text-sm">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="font-medium">3:00 PM IST</span>
            <span className="text-zinc-500 hidden sm:inline">| 1 hr</span>
          </div>

          <button
            onClick={handleRegister}
            className="flex items-center gap-1 font-bold text-red-400 hover:text-red-300 bg-red-950/60 hover:bg-red-900/60 border border-red-500/40 px-3.5 py-1.5 rounded-md transition-all cursor-pointer shadow-xs text-xs sm:text-sm"
          >
            <span>Register Now</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
