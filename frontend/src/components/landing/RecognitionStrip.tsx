import React from "react";
import { Star, Award } from "lucide-react";

interface RecognitionStripProps {
  isDarkMode: boolean;
}

export const RecognitionStrip: React.FC<RecognitionStripProps> = ({ isDarkMode }) => {
  const recognitions = [
    {
      source: "Capterra",
      award: "SHORTLIST",
      year: "2023",
      rating: "4.5/5",
      reviews: "1,200+ Reviews",
      color: "text-amber-500",
    },
    {
      source: "GetApp",
      award: "CATEGORY LEADERS",
      year: "2023",
      rating: "4.5/5",
      reviews: "Top Ranked",
      color: "text-blue-500",
    },
    {
      source: "G2",
      award: "BEST USABILITY",
      year: "2024",
      rating: "4.7/5",
      reviews: "Leader Badge",
      color: "text-red-500",
    },
  ];

  return (
    <div
      className={`py-12 border-b transition-colors duration-200 ${
        isDarkMode
          ? "bg-zinc-950 border-zinc-800 text-white"
          : "bg-white border-zinc-100 text-zinc-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mb-8">
          AS RECOGNIZED BY
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto items-center">
          {recognitions.map((item) => (
            <div
              key={item.source}
              className={`p-6 rounded-2xl border text-center relative group hover:-translate-y-1 transition-all ${
                isDarkMode
                  ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                  : "bg-[#FFFDF9] border-zinc-200/80 hover:border-zinc-300 shadow-xs"
              }`}
            >
              {/* Laurel wreath aesthetic icon */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-xl text-amber-500 font-serif font-bold">‹‹</span>
                <Award className={`w-6 h-6 ${item.color}`} />
                <span className="text-xl text-amber-500 font-serif font-bold">››</span>
              </div>

              <div className="font-extrabold text-sm tracking-tight mb-0.5">
                {item.source}
              </div>
              <div className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">
                {item.award} {item.year}
              </div>

              <div className="flex items-center justify-center gap-1.5 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  {item.rating}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
