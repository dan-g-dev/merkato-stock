import React from "react";
import { ArrowRight } from "lucide-react";

interface IntegrationsSectionProps {
  isDarkMode: boolean;
  onExploreAll: () => void;
}

export const IntegrationsSection: React.FC<IntegrationsSectionProps> = ({
  isDarkMode,
  onExploreAll,
}) => {
  const partners = [
    { name: "Shopify", category: "E-Commerce", color: "text-[#95BF47]" },
    { name: "PayPal", category: "Payments", color: "text-[#003087]" },
    { name: "Google", category: "Cloud & Analytics", color: "text-[#4285F4]" },
    { name: "Salesforce", category: "CRM", color: "text-[#00A1E0]" },
    { name: "Stripe", category: "Payments", color: "text-[#635BFF]" },
    { name: "Amazon", category: "Marketplace", color: "text-[#FF9900]" },
    { name: "Etsy", category: "Handmade & Vintage", color: "text-[#F16521]" },
    { name: "eBay", category: "Auctions & Retail", color: "text-[#E53238]" },
    { name: "QuickBooks", category: "Accounting", color: "text-[#2CA01C]" },
    { name: "Xero", category: "Accounting", color: "text-[#13B5EA]" },
    { name: "FedEx", category: "Shipping Carrier", color: "text-[#4D148C]" },
    { name: "UPS", category: "Shipping Carrier", color: "text-[#351C15]" },
  ];

  return (
    <section
      id="integrations"
      className={`py-20 border-b transition-colors duration-200 ${
        isDarkMode
          ? "bg-zinc-950 border-zinc-800 text-white"
          : "bg-[#FFFDF9] border-zinc-200 text-zinc-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#E42528] mb-3">
            YOUR UNIFIED PLATFORM
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Connects with all the apps you rely on
          </h2>
          <p className="text-base text-zinc-500 dark:text-zinc-400">
            From marketplaces and shopping carts to payment gateways and shipping carriers, MERKATO
            STOCK plugs directly into your business stack.
          </p>
        </div>

        {/* Integration Tiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className={`p-5 rounded-xl border text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md group cursor-pointer ${
                isDarkMode
                  ? "bg-zinc-900/80 border-zinc-800 hover:border-zinc-700"
                  : "bg-white border-zinc-200/80 hover:border-zinc-300"
              }`}
            >
              <div
                className={`font-black text-lg tracking-tight mb-1 transition-colors ${partner.color}`}
              >
                {partner.name}
              </div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                {partner.category}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onExploreAll}
            className="inline-flex items-center gap-2 font-bold text-sm text-[#E42528] hover:text-red-700 transition-colors cursor-pointer"
          >
            <span>More Integrations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
