"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/signin", { email, password });
      const { data: user } = response.data;
      const token = user?.access_token;

      // Role check: Only ADMIN or COURSE_ADMIN can access
      if (
        !user ||
        (user.role !== "FINANCE_ADMIN" && user.role !== "SUPER_ADMIN")
      ) {
        setError(
          "Access Denied: You do not have the required permissions to access this dashboard.",
        );
        setLoading(false);
        return;
      }

      // Store token and user info
      localStorage.setItem("nebiant_admin_token", token);
      localStorage.setItem("nebiant_admin_user", JSON.stringify(user));

      toast.success(`Welcome back, ${user.name}!`);
      router.push("/");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl -z-0" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-100/50 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl -z-0" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-indigo-100 border border-slate-100 p-8 md:p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100/20 rounded-bl-[100px] -z-0" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full scale-150 animate-pulse" />
              <div className="relative w-20 h-20 bg-white rounded-[28px] shadow-xl shadow-indigo-50 flex items-center justify-center p-4">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-2xl font-black text-slate-900 mb-1 uppercase tracking-tighter">
                Finance Dashboard
              </h1>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] leading-none">
                10alytics Business
              </p>
            </div>

            {error && (
              <div className="w-full mb-6 bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-rose-600 leading-tight">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                  <input
                    type="email"
                    required
                    placeholder="admin@10alytics.com"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 uppercase tracking-widest text-xs mt-4 flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
