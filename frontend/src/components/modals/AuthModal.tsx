import React, { useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { MerkatoLogo } from "../common/MerkatoLogo";
import { useAuth } from "../../context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  mode: "signup" | "signin";
  onClose: () => void;
  onSuccess: () => void;
  isDarkMode: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode,
  onClose,
  onSuccess,
  isDarkMode,
}) => {
  const { login, register, error, clearError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"signup" | "signin">(mode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = authMode === "signup" ? await register(name, email, password) : await login(email, password);
    setIsSubmitting(false);
    if (success) onSuccess();
  };

  // Logs straight into the seeded Employee demo account so visitors can
  // explore the dashboard without filling in a form. This still goes
  // through the real /api/auth/login endpoint - it's not a login bypass.
  const handleInstantDemo = async () => {
    clearError();
    setIsSubmitting(true);
    const success = await login("employee@merkatostock.com", "Password123!");
    setIsSubmitting(false);
    if (success) onSuccess();
  };

  const switchMode = (next: "signup" | "signin") => {
    clearError();
    setAuthMode(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in-50 duration-150">
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 sm:p-8 relative ${
          isDarkMode ? "bg-zinc-900 border-zinc-700 text-white" : "bg-white border-zinc-200 text-zinc-900"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <MerkatoLogo isDark={isDarkMode} size="lg" />
          </div>
          <h3 className="text-2xl font-black">
            {authMode === "signup" ? "Get started with MERKATO STOCK" : "Sign In to your account"}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {authMode === "signup"
              ? "Create your account - free during the demo period."
              : "Enter your account credentials or launch the instant demo."}
          </p>
        </div>

        {/* Quick Demo Access Button - logs into a real seeded Employee account */}
        <div className="mb-4">
          <button
            onClick={handleInstantDemo}
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all disabled:opacity-60"
          >
            <span>Instant Demo Access</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="relative flex py-2 items-center mb-4">
          <div className="grow border-t border-zinc-200 dark:border-zinc-800" />
          <span className="shrink mx-4 text-zinc-400 text-[11px] uppercase font-bold">Or</span>
          <div className="grow border-t border-zinc-200 dark:border-zinc-800" />
        </div>

        {error && <div className="mb-3.5 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-300 rounded-lg px-3 py-2">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authMode === "signup" && (
            <div>
              <label className="block text-xs font-bold mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Abebe Kebede"
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@merkatostock.com"
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Password</label>
            <input
              type="password"
              required
              minLength={authMode === "signup" ? 8 : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-[#E42528] hover:bg-[#c91d20] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? "Please wait..." : authMode === "signup" ? "Create Account" : "Sign In to Dashboard"}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-zinc-500">
          {authMode === "signup" ? (
            <span>
              Already have an account?{" "}
              <button onClick={() => switchMode("signin")} className="text-red-500 font-bold hover:underline">
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{" "}
              <button onClick={() => switchMode("signup")} className="text-red-500 font-bold hover:underline">
                Sign Up Free
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
