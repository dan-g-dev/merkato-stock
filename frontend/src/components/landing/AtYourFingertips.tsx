import React from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface AtYourFingertipsProps {
  onSignUp: () => void;
  onExploreDemo: () => void;
}

export const AtYourFingertips: React.FC<AtYourFingertipsProps> = ({
  onSignUp,
  onExploreDemo,
}) => {
  const checklist = [
    "Accurate stock tracking with barcode and RFID system",
    "Configure and apply local taxes",
    "Track items based on batches and serial numbers",
    "Generate instant reports",
    "Receive low stock alerts with reorder points",
    "Transact across currencies and countries",
    "Adjust inventory levels",
    "Customize user roles and permissions",
    "Sell at your pace with UOM conversion",
    "Collaborate better with custom and standard alerts",
  ];

  return (
    <section
      id="at-your-fingertips"
      className="py-20 bg-[#D32F2F] text-white relative overflow-hidden"
    >
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-black uppercase tracking-[0.25em] text-red-200">
              AT YOUR FINGERTIPS
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-tight">
              Know your inventory and grow your business
            </h2>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <button
                onClick={onSignUp}
                className="bg-white hover:bg-zinc-100 text-[#D32F2F] font-black text-xs sm:text-sm px-6 py-3.5 rounded-md uppercase tracking-wider transition-all shadow-md cursor-pointer hover:scale-102"
              >
                SIGN UP FOR FREE
              </button>

              <button
                onClick={onExploreDemo}
                className="border-2 border-white/80 hover:border-white bg-transparent hover:bg-white/10 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-md uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>EXPLORE DEMO ACCOUNT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: 2-Column Checklist */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-red-200 shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base font-medium text-white/95 leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
