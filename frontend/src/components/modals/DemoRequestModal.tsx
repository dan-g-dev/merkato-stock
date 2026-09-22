import React, { useState } from "react";
import { X, Calendar, CheckCircle2, Clock, Users, Building } from "lucide-react";

interface DemoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const DemoRequestModal: React.FC<DemoRequestModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("2026-09-18");
  const [orderVolume, setOrderVolume] = useState("500 - 3,000 / month");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/leads/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, phone, preferredDate, orderVolume }),
      });
      if (res.ok) {
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in-50 duration-150">
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 relative overflow-hidden ${
          isDarkMode ? "bg-zinc-900 border-zinc-700 text-white" : "bg-white border-zinc-200 text-zinc-900"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black">Demo Scheduled!</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              Thank you, {name}. A MERKATO STOCK product specialist has reserved your slot on{" "}
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{preferredDate}</span>. An invitation has been sent to {email}.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-lg bg-[#E42528] text-white font-bold text-sm uppercase tracking-wider hover:bg-red-700 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="text-xs font-bold text-[#E42528] uppercase tracking-wider mb-1">
                MERKATO STOCK CONSULTATION
              </div>
              <h3 className="text-2xl font-black">Request a Personalized Demo</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                See how our cloud inventory platform streamlines multi-warehouse picking, kitting, and order routing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold mb-1 text-zinc-700 dark:text-zinc-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-zinc-700 dark:text-zinc-300">
                  Business Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-zinc-700 dark:text-zinc-300">
                  Company Name
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Logistics Corp"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-zinc-700 dark:text-zinc-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1 text-zinc-700 dark:text-zinc-300">
                  Preferred Demo Date
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-zinc-700 dark:text-zinc-300">
                  Monthly Orders Volume
                </label>
                <select
                  value={orderVolume}
                  onChange={(e) => setOrderVolume(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  <option>Under 500 orders</option>
                  <option>500 - 3,000 / month</option>
                  <option>3,000 - 10,000 / month</option>
                  <option>10,000+ enterprise</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-lg bg-[#E42528] hover:bg-[#c91d20] text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? "Scheduling..." : "Confirm Demo Appointment"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
