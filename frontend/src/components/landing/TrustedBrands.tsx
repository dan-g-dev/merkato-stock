import React from "react";
import { CLIENT_LOGOS } from "../../data/merkatoContent";

interface TrustedBrandsProps {
  isDarkMode: boolean;
}

export const TrustedBrands: React.FC<TrustedBrandsProps> = ({ isDarkMode }) => {
  return (
    <section
      className={`py-12 border-b transition-colors duration-200 ${
        isDarkMode
          ? "bg-zinc-950 border-zinc-800 text-zinc-400"
          : "bg-white border-zinc-100 text-zinc-500"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] mb-8 text-zinc-400 dark:text-zinc-500">
          TRUSTED BY SUCCESSFUL COMPANIES WORLDWIDE
        </p>

        {/* Brand logos grid with authentic stylized typographic badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-6 items-center justify-items-center opacity-80 hover:opacity-100 transition-opacity">
          {CLIENT_LOGOS.map((brand) => (
            <div
              key={brand.name}
              className="flex flex-col items-center justify-center p-2 group transition-transform hover:scale-105"
            >
              <div
                className={`font-black text-sm tracking-tight transition-colors ${
                  isDarkMode
                    ? "text-zinc-300 group-hover:text-white"
                    : "text-zinc-800 group-hover:text-black"
                }`}
              >
                {brand.name}
              </div>
              <span className="text-[8px] tracking-widest uppercase text-zinc-400 font-semibold mt-0.5">
                {brand.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
