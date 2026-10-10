import React, { useState } from "react";
import { MessageSquare, X, ArrowRight, Send } from "lucide-react";

interface FloatingDemoWidgetProps {
  onClick: () => void;
}

export const FloatingDemoWidget: React.FC<FloatingDemoWidgetProps> = ({ onClick }) => {
  const [showOnlineBubble, setShowOnlineBubble] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "bot" | "user"; text: string }>>([
    { sender: "bot", text: "Hello! Welcome to MERKATO STOCK. How may I help you today?" },
  ]);
  const [inputVal, setInputVal] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const userText = inputVal.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputVal("");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Thanks for reaching out! Would you like to schedule a personalized 1-on-1 demo or explore the live demo account?",
        },
      ]);
    }, 800);
  };

  return (
    <>
      <aside
        aria-label="MERKATO live assistance"
        className="fixed bottom-18 right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2.5 select-none"
      >
        {/* "Request a demo" specialist avatar badge (Visible on md+ screens as in image 4) */}
        <div
          onClick={onClick}
          className="hidden sm:flex items-center gap-2 group cursor-pointer"
        >
          <div className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-3.5 py-1.5 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700 text-xs font-semibold relative group-hover:scale-105 transition-transform">
            <span>Request a demo</span>
            {/* Arrow tail */}
            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-white dark:border-l-zinc-800" />
          </div>

          <div className="relative w-11 h-11 rounded-full bg-[#F5A623] p-0.5 shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              alt="Merkato Demo Specialist"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* "We're Online! How may I help you today?" popover bubble (As shown in screenshots 1, 2, 3, 4, 5) */}
        <div className="flex items-center gap-2 relative">
          {showOnlineBubble && (
            <div className="relative bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-zinc-200/90 dark:border-zinc-700 text-left max-w-[210px] sm:max-w-[240px] animate-in fade-in-50 zoom-in-95 duration-200">
              {/* Close 'X' Button on top-left of bubble */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowOnlineBubble(false);
                }}
                className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center hover:bg-zinc-700 transition-colors shadow-md cursor-pointer"
                title="Dismiss"
                aria-label="Dismiss chat prompt"
              >
                <X className="w-3 h-3" />
              </button>

              <div
                onClick={() => setIsChatOpen(true)}
                className="cursor-pointer"
              >
                <p className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">
                  We're Online!
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-300 mt-0.5 leading-snug">
                  How may I help you today?
                </p>
              </div>

              {/* Right tail pointing to the yellow circle button */}
              <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-white dark:border-l-zinc-800" />
            </div>
          )}

          {/* Yellow/Amber Chat Circle Button (Official Merkato Live Chat Icon) */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#F5A623] hover:bg-[#e0961b] active:scale-95 text-white flex items-center justify-center shadow-xl shadow-amber-500/25 transition-all cursor-pointer shrink-0"
            aria-label="Open live chat assistant"
          >
            <svg
              className="w-7 h-7 fill-white"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 4h16v12H5.17L4 17.17V4m0-2c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H4zm2 10h12v-2H6v2zm0-3h12V7H6v2z" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Interactive Quick Chat Drawer / Window when user opens chat */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-3 sm:bottom-24 sm:right-6 z-50 w-[92vw] sm:w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 max-h-[440px]">
          {/* Header */}
          <div className="bg-[#E42528] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <p className="text-xs font-bold leading-none">MERKATO Live Assistance</p>
                <p className="text-[10px] text-rose-100 mt-0.5">Typically replies in seconds</p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white/80 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages list */}
          <div className="p-3.5 flex-1 overflow-y-auto space-y-2.5 text-xs">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#E42528] text-white rounded-br-none"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions in chat */}
          <div className="p-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex gap-2 overflow-x-auto">
            <button
              onClick={() => {
                setIsChatOpen(false);
                onClick();
              }}
              className="text-[11px] font-bold text-[#E42528] bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-red-100"
            >
              Schedule Demo
            </button>
            <button
              onClick={() => {
                setChatMessages((prev) => [
                  ...prev,
                  { sender: "user", text: "What are your pricing plans?" },
                  { sender: "bot", text: "We offer Free forever plans up to Standard, Professional, and Elite tiers!" },
                ]);
              }}
              className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-200/60 dark:bg-zinc-800 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-zinc-200"
            >
              View Pricing
            </button>
          </div>

          {/* Input field */}
          <form
            onSubmit={handleSendMessage}
            className="p-2.5 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <button
              type="submit"
              className="w-7 h-7 rounded-lg bg-[#E42528] text-white flex items-center justify-center hover:bg-[#c91d20] shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
