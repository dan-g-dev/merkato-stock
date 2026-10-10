import React, { useState } from "react";
import { X, Calendar, Video, Clock, CheckCircle2 } from "lucide-react";

interface WebinarModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const WebinarModal: React.FC<WebinarModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("United States");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/leads/webinar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, country }),
      });
      if (res.ok) {
        setRegistered(true);
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
        className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 relative ${
          isDarkMode ? "bg-zinc-900 border-zinc-700 text-white" : "bg-white border-zinc-200 text-zinc-900"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600"
        >
          <X className="w-5 h-5" />
        </button>

        {registered ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black">Seat Reserved!</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              You are registered for the next live webinar on weekday 3:00 PM IST. Meeting link sent to {email}.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-5 py-2 rounded-lg bg-[#E42528] text-white font-bold text-xs uppercase"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider">
              <Video className="w-4 h-4" />
              <span>Free Live Product Webinar</span>
            </div>

            <h3 className="text-xl font-black">Join MERKATO STOCK in Action</h3>

            <div className="bg-zinc-100 dark:bg-zinc-800/60 p-3 rounded-xl space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-red-500" />
                <span>Every Weekday</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>3:00 PM IST (1 Hour Live Q&A)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@work.com"
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Country / Region</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#E42528] hover:bg-[#c91d20] text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              {loading ? "Registering..." : "Reserve My Seat"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
