import React from "react";

interface MerkatoLogoProps {
  className?: string;
  showProduct?: boolean;
  isDark?: boolean;
  isDarkMode?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "corporate" | "product";
}

export const MerkatoLogo: React.FC<MerkatoLogoProps> = ({
  className = "",
  showProduct = true,
  isDark = false,
  isDarkMode = false,
  size = "md",
  variant = "product",
}) => {
  const effectiveDark = isDark || isDarkMode;

  if (variant === "corporate") {
    const iconSize = size === "sm" ? "w-4 h-4 text-[9px]" : size === "lg" ? "w-6 h-6 text-xs" : "w-5 h-5 text-[10px]";
    const brandTextSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";

    return (
      <div className={`flex items-center gap-2.5 select-none cursor-pointer ${className}`}>
        {/* MERKATO 4-tile colorful geometric mark */}
        <div className="grid grid-cols-2 gap-[2px]">
          <div className={`${iconSize} rounded-[2px] bg-[#E42528] flex items-center justify-center font-black text-white shadow-xs`}>
            M
          </div>
          <div className={`${iconSize} rounded-[2px] bg-[#2E9B44] flex items-center justify-center font-black text-white shadow-xs`}>
            S
          </div>
          <div className={`${iconSize} rounded-[2px] bg-[#1E74D4] flex items-center justify-center font-black text-white shadow-xs`}>
            T
          </div>
          <div className={`${iconSize} rounded-[2px] bg-[#F4A911] flex items-center justify-center font-black text-white shadow-xs`}>
            K
          </div>
        </div>

        {/* Brand typography */}
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight ${effectiveDark ? "text-white" : "text-zinc-900"} ${brandTextSize}`}>
            MERKATO
          </span>
          <span className={`font-black tracking-tight text-[#E42528] ${brandTextSize}`}>
            STOCK
          </span>
        </div>
      </div>
    );
  }

  // Official MERKATO STOCK Product Logo with Red Logistics Cart & Stacked Name
  const cartSize = size === "sm" ? "w-7 h-7" : size === "lg" ? "w-11 h-11" : "w-9 h-9";
  const merkatoSize = size === "sm" ? "text-xs font-bold" : size === "lg" ? "text-sm font-extrabold" : "text-[13px] font-bold";
  const stockSize = size === "sm" ? "text-sm font-black" : size === "lg" ? "text-xl font-black" : "text-base font-black";

  return (
    <div className={`flex items-center gap-2.5 select-none cursor-pointer ${className}`}>
      {/* Red Cart / Hand Truck Logistics Icon */}
      <svg
        className={`${cartSize} shrink-0 text-[#E42528]`}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cart handle and slanted back */}
        <path
          d="M8 8 L13 8 L17 34 L38 34"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Cart box frame */}
        <rect
          x="16"
          y="13"
          width="23"
          height="16"
          rx="2.5"
          transform="rotate(-4 16 13)"
          stroke="currentColor"
          strokeWidth="2.8"
          fill="#FFF4F2"
        />
        {/* Box tape strip inside */}
        <path
          d="M20 18 L34 17"
          stroke="#F59E0B"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Wheels */}
        <circle cx="18" cy="39" r="3.2" fill="currentColor" />
        <circle cx="36" cy="39" r="3.2" fill="currentColor" />
      </svg>

      {/* Brand + Product text stacked for MERKATO STOCK */}
      <div className="flex flex-col justify-center leading-tight">
        <span
          className={`tracking-tight uppercase ${
            effectiveDark ? "text-zinc-300" : "text-zinc-800"
          } ${merkatoSize}`}
        >
          MERKATO
        </span>
        <span
          className={`tracking-tight -mt-0.5 text-[#E42528] ${stockSize}`}
        >
          STOCK
        </span>
      </div>
    </div>
  );
};
