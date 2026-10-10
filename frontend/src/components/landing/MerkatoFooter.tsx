import React, { useState } from "react";
import { Globe, Phone, Mail, MapPin, ChevronDown, ExternalLink } from "lucide-react";
import { MerkatoLogo } from "../common/MerkatoLogo";

interface MerkatoFooterProps {
  isDarkMode: boolean;
  onRequestDemo: () => void;
  onOpenFreeTool: (toolName: string) => void;
}

export const MerkatoFooter: React.FC<MerkatoFooterProps> = ({
  isDarkMode,
  onRequestDemo,
  onOpenFreeTool,
}) => {
  const [edition, setEdition] = useState("Global");
  const [showEditionMenu, setShowEditionMenu] = useState(false);

  const editions = ["Global", "United States", "United Kingdom", "India", "Australia", "Canada", "Ethiopia", "United Arab Emirates", "Saudi Arabia"];

  const financeApps = [
    { name: "Merkato Books", tag: "Accounting" },
    { name: "Merkato Expense", tag: "Travel & Expense" },
    { name: "Merkato Billing", tag: "Subscriptions" },
    { name: "Merkato Invoice", tag: "100% Free Invoicing" },
    { name: "Merkato Commerce", tag: "E-Commerce Platform" },
    { name: "Merkato Logistics", tag: "Freight & Delivery" },
  ];

  const freeTools = [
    "Barcode Generator",
    "SKU Generator",
    "Purchase Order Generator",
    "Shipping Label Generator",
    "Reorder Point Calculator",
    "Break-Even Point Calculator",
    "Wholesale Price Calculator",
    "EOQ Calculator",
  ];

  return (
    <footer
      className={`border-t transition-colors duration-200 text-xs ${
        isDarkMode
          ? "bg-zinc-950 border-zinc-800 text-zinc-400"
          : "bg-[#111317] border-zinc-800 text-zinc-400"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        {/* Brand Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-10 mb-10 border-b border-zinc-800 gap-4">
          <MerkatoLogo isDarkMode={true} variant="corporate" size="md" />
          <p className="text-xs text-zinc-400 max-w-md">
            MERKATO STOCK is modern cloud-based inventory management software that helps you create and manage your sales and purchase orders, warehouse stock, and automated multi-channel logistics.
          </p>
        </div>

        {/* Main 5-Column Link Structure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {/* Column 1: Features */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Features
            </h4>
            <ul className="space-y-2">
              {[
                "Inventory management",
                "Warehousing",
                "Order management",
                "Order fulfillment",
                "Automation and analytics",
                "Mobile apps",
                "AI in MERKATO STOCK",
                "MERKATO STOCK Desktop",
              ].map((link) => (
                <li key={link}>
                  <a href="#software-preview" className="hover:text-red-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Solutions & Resources */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Solutions & Learn
            </h4>
            <ul className="space-y-2">
              {[
                "Pricing comparison",
                "Customer success stories",
                "Schedule a demo",
                "Jumpstart program",
                "Partner ecosystem",
                "What is warehouse management?",
                "Inventory dictionary",
                "Free webinars",
              ].map((link) => (
                <li key={link}>
                  <button
                    onClick={onRequestDemo}
                    className="hover:text-red-400 transition-colors text-left cursor-pointer"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Integrations */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Integrations
            </h4>
            <ul className="space-y-2">
              {[
                "Amazon Integration",
                "Shopify App",
                "Etsy Sync",
                "eBay Connector",
                "Accounting Bridge",
                "CRM Connector",
                "Stripe Gateway",
                "UPS & FedEx Carrier Sync",
              ].map((link) => (
                <li key={link}>
                  <a href="#integrations" className="hover:text-red-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Free Tools */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Free Tools
            </h4>
            <ul className="space-y-2">
              {freeTools.map((tool) => (
                <li key={tool}>
                  <button
                    onClick={() => onOpenFreeTool(tool)}
                    className="hover:text-red-400 transition-colors text-left flex items-center gap-1 group cursor-pointer"
                  >
                    <span>{tool}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-red-400" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact Us */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Contact Us
            </h4>
            <div className="space-y-2.5 text-zinc-300">
              <div className="text-[11px] text-zinc-400">Available: Monday - Friday (24/5)</div>
              
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="font-semibold text-white">+1 (800) 419-STOCK</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <a href="mailto:support@merkatostock.com" className="text-zinc-300 hover:text-white transition-colors">
                  support@merkatostock.com
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <a href="mailto:sales@merkatostock.com" className="text-zinc-300 hover:text-white transition-colors">
                  sales@merkatostock.com
                </a>
              </div>

              {/* Physical Office Address */}
              <div className="flex items-start gap-2 pt-1 text-zinc-300">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <div className="font-semibold text-white">MERKATO STOCK HQ:</div>
                  <div>Merkato Commercial Tower, Suite 700</div>
                  <div>Addis Ababa, Ethiopia</div>
                  <div className="text-zinc-400 mt-1">US Branch: 550 Montgomery St, Suite 400, San Francisco, CA 94111</div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onRequestDemo}
                className="w-full py-2 px-3 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Request a Demo
              </button>
            </div>
          </div>
        </div>

        {/* Edition Selector & Ecosystem Bar */}
        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          {/* Edition dropdown */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-[11px] uppercase tracking-wider">
                SELECT REGION :
              </span>
              <button
                onClick={() => setShowEditionMenu(!showEditionMenu)}
                className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-3 py-1.5 rounded border border-zinc-700 font-semibold cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-red-400" />
                <span>{edition}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {showEditionMenu && (
              <div className="absolute bottom-full mb-2 left-28 w-44 bg-zinc-900 border border-zinc-700 rounded-md shadow-xl py-1 z-50">
                {editions.map((ed) => (
                  <button
                    key={ed}
                    onClick={() => {
                      setEdition(ed);
                      setShowEditionMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-red-600 hover:text-white transition-colors cursor-pointer ${
                      ed === edition ? "text-red-400 font-bold" : "text-zinc-300"
                    }`}
                  >
                    {ed}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Other Connected Apps */}
          <div className="text-center md:text-right">
            <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-2">
              MERKATO COMMERCE & LOGISTICS ECOSYSTEM
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-xs">
              {financeApps.map((app) => (
                <span
                  key={app.name}
                  className="hover:text-white cursor-pointer transition-colors text-zinc-300 font-medium"
                >
                  {app.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-6 border-t border-zinc-800/80 text-[11px] text-zinc-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {[
              "Contact",
              "Security",
              "Compliance",
              "IPR Complaints",
              "Anti-spam Policy",
              "Terms of Service",
              "Privacy Policy",
              "Trademark Policy",
              "Cookie Policy",
              "GDPR Compliance",
              "Abuse Policy",
            ].map((policy) => (
              <span key={policy} className="hover:text-zinc-400 cursor-pointer">
                {policy}
              </span>
            ))}
          </div>

          <div className="text-center md:text-right font-medium">
            © 2026, MERKATO STOCK Inc. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
