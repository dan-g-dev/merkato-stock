import React, { useState } from "react";
import { Lock, Mail, ArrowLeft } from "lucide-react";
import { MerkatoLogo } from "../common/MerkatoLogo";
import { useAuth } from "../../context/AuthContext";

// Shown whenever the dashboard is opened without a valid session. Also used
// for the landing page's "Instant Demo Access" flow (see AuthModal.tsx),
// which just pre-fills one of the seeded demo accounts below and submits.
export const LoginScreen: React.FC<{ isDarkMode: boolean; onBackToHome: () => void }> = ({ isDarkMode, onBackToHome }) => {
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const demoAccounts = [
    { label: "Admin", email: "admin@merkatostock.com" },
    { label: "Manager", email: "manager@merkatostock.com" },
    { label: "Employee", email: "employee@merkatostock.com" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await login(email, password);
    setIsSubmitting(false);
  };

  const handleDemoLogin = async (demoEmail: string) => {
    clearError();
    setEmail(demoEmail);
    setPassword("Password123!");
    setIsSubmitting(true);
    await login(demoEmail, "Password123!");
    setIsSubmitting(false);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? "bg-zinc-950 text-white" : "bg-zinc-50 text-zinc-900"}`}>
      <div className="w-full max-w-md">
        <button onClick={onBackToHome} className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to homepage
        </button>

        <div className={`rounded-2xl border shadow-xl p-6 sm:p-8 ${isDarkMode ? "bg-zinc-900 border-zinc-700" : "bg-white border-zinc-200"}`}>
          <div className="flex justify-center mb-4">
            <MerkatoLogo isDark={isDarkMode} size="lg" />
          </div>
          <h1 className="text-xl font-black text-center">Sign in to Merkato Stock</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-1">Smart Inventory Management for Ethiopian Businesses</p>

          {error && <div className="mt-4 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-300 rounded-lg px-3 py-2">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-3.5 mt-5">
            <div>
              <label className="block text-xs font-bold mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@merkatostock.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg bg-[#E42528] hover:bg-[#c91d20] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="relative flex py-2 items-center mt-5 mb-3">
            <div className="grow border-t border-zinc-200 dark:border-zinc-800" />
            <span className="shrink mx-3 text-zinc-400 text-[11px] uppercase font-bold">Quick demo login</span>
            <div className="grow border-t border-zinc-200 dark:border-zinc-800" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {demoAccounts.map((acct) => (
              <button
                key={acct.email}
                onClick={() => handleDemoLogin(acct.email)}
                disabled={isSubmitting}
                className="py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-[11px] font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-60"
              >
                {acct.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-zinc-400 mt-3 text-center">
            Demo accounts, password: <span className="font-mono">Password123!</span> - development only.
          </p>
        </div>
      </div>
    </div>
  );
};
