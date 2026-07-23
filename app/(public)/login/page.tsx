"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.session) {
        // Set cookie for proxy
        document.cookie = "admin_session=true; path=/; max-age=86400; SameSite=Strict";
        toast.success("Login berhasil! Mengalihkan...");

        setTimeout(() => {
          router.push("/admin");
        }, 800);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal masuk. Periksa email dan password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-[120px] opacity-60 z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D6EFD8] rounded-full blur-[120px] opacity-60 z-0"></div>

      <Toaster position="top-center" reverseOrder={false} />

      <div className="backdrop-blur-md bg-white/90 rounded-3xl border border-white/60 shadow-2xl shadow-emerald-950/5 max-w-md w-full p-8 md:p-10 relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1A5319]/10 to-emerald-50 border border-emerald-100 flex items-center justify-center mb-6 shadow-md shadow-emerald-900/5">
          <span className="text-2xl">🍈</span>
        </div>

        <h1 className="text-2xl font-black text-gray-900 tracking-tight text-center">Admin Panel</h1>
        <p className="text-gray-400 text-xs mt-1.5 mb-8 text-center leading-relaxed font-medium">
          Masuk dengan kredensial administrator Poktan Banyu Urip.
        </p>

        <form onSubmit={handleLogin} className="w-full space-y-5">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@example.com"
                className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#10b981] transition-all text-sm font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#10b981] transition-all text-sm font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A5319] hover:bg-[#508D4E] disabled:bg-emerald-800 text-white font-bold text-sm py-3.5 rounded-xl shadow-md shadow-emerald-900/10 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>MASUK</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
