import React, { useState } from "react";
import { Code2, Zap, Webhook, Play, Check, Copy } from "lucide-react";

interface ExtensibilitySectionProps {
  isDarkMode: boolean;
}

export const ExtensibilitySection: React.FC<ExtensibilitySectionProps> = ({ isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<"workflows" | "updates" | "webhooks">("workflows");
  const [copied, setCopied] = useState(false);
  const [runOutput, setRunOutput] = useState<string | null>(null);

  const codeSnippets = {
    workflows: `// Custom Deluge function: Auto Apply Tiered Discount
void Invoice_Discount(string salesOrderId, map orderDetails) 
{
    total = orderDetails.get("total_amount");
    customerId = orderDetails.get("customer_id");
    
    // Check if wholesale VIP client
    if (total > 1000.00) 
    {
        discountMap = Map();
        discountMap.put("discount_percentage", 12.5);
        discountMap.put("reason", "VIP High Volume Tier");
        
        response = merkato.stock.updateRecord("SalesOrders", salesOrderId, discountMap);
        info "Discount successfully applied: " + response.get("code");
    }
}`,
    updates: `// Trigger automated notification upon low stock
void Stock_Depletion_Alert(string itemId, int currentStock) 
{
    if (currentStock <= 10) 
    {
        item = merkato.stock.getRecordById("Items", itemId);
        payload = {
            "text": "⚠️ Low Stock Alert: " + item.get("name") + " (" + currentStock + " units remaining)"
        };
        postUrl("https://chat.merkatostock.com/api/v2/channels/warehouse-ops/message", payload);
    }
}`,
    webhooks: `// Outgoing Webhook on "Order Fulfilled"
POST /api/v1/logistics/dispatch-notify
Content-Type: application/json
Authorization: Bearer merkato_prod_sec_994102

{
    "event": "salesorder.fulfilled",
    "order_number": "SO-00491",
    "carrier": "USPS Priority",
    "tracking_number": "9400111899562200481902",
    "customer": "Global Trade Logistics"
}`,
  };

  const handleRunCode = () => {
    setRunOutput("Executing Deluge script...\n✓ Function compiled in 42ms\n✓ Triggered on event: salesorder.create\n✓ Return status 200 OK: Rule applied successfully.");
    setTimeout(() => setRunOutput(null), 5000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      className={`py-20 border-b transition-colors duration-200 ${
        isDarkMode
          ? "bg-zinc-950 border-zinc-800 text-white"
          : "bg-white border-zinc-100 text-zinc-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Information & Tab selectors */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#E42528]">
              WHY MERKATO STOCK
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              It's flexible. It's extensible. It's made to work with your needs.
            </h2>

            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Tailor MERKATO STOCK to fit your exact warehouse mechanics with low-code automation
              scripts, custom fields, webhooks, and granular triggers.
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => setActiveTab("workflows")}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  activeTab === "workflows"
                    ? isDarkMode
                      ? "bg-zinc-900 border-red-500/50 shadow-md"
                      : "bg-red-50/50 border-red-200 shadow-xs"
                    : isDarkMode
                    ? "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                    : "bg-white border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      activeTab === "workflows"
                        ? "bg-[#E42528] text-white"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Personalized workflows</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Automate your business processes. Trigger custom actions upon certain events.
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("updates")}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  activeTab === "updates"
                    ? isDarkMode
                      ? "bg-zinc-900 border-red-500/50 shadow-md"
                      : "bg-red-50/50 border-red-200 shadow-xs"
                    : isDarkMode
                    ? "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                    : "bg-white border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      activeTab === "updates"
                        ? "bg-[#E42528] text-white"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Custom updates & scripts</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Send automatic restock alerts, compute taxes, or reprice catalog bundles.
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("webhooks")}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  activeTab === "webhooks"
                    ? isDarkMode
                      ? "bg-zinc-900 border-red-500/50 shadow-md"
                      : "bg-red-50/50 border-red-200 shadow-xs"
                    : isDarkMode
                    ? "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                    : "bg-white border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      activeTab === "webhooks"
                        ? "bg-[#E42528] text-white"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    <Webhook className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Webhooks & REST APIs</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Stream orders and ship status to your proprietary ERP or WMS systems.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Code Editor preview */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 bg-[#1E1E24] text-zinc-200">
              {/* Editor Header bar */}
              <div className="px-4 py-3 bg-[#18181C] border-b border-zinc-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/70" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <span className="w-3 h-3 rounded-full bg-green-500/70" />
                  <span className="ml-3 font-mono text-zinc-400 text-[11px]">
                    {activeTab === "workflows"
                      ? "Invoice_Discount.deluge"
                      : activeTab === "updates"
                      ? "Stock_Depletion_Alert.deluge"
                      : "webhook_payload.json"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    title="Copy code"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={handleRunCode}
                    className="bg-[#E42528] hover:bg-red-700 text-white font-bold px-3 py-1 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run Test</span>
                  </button>
                </div>
              </div>

              {/* Code text display */}
              <div className="p-4 sm:p-6 overflow-x-auto">
                <pre className="font-mono text-xs sm:text-[13px] leading-relaxed text-zinc-300">
                  <code>{codeSnippets[activeTab]}</code>
                </pre>
              </div>

              {/* Simulated execution console */}
              {runOutput && (
                <div className="p-3 bg-black/80 border-t border-zinc-800 font-mono text-xs text-emerald-400 animate-in fade-in-50">
                  <pre>{runOutput}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
