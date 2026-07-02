"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import api from "@/lib/axios";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("nebiant_admin_token");
      const userStr = localStorage.getItem("nebiant_admin_user");

      if (!token || !userStr) {
        if (pathname !== "/login") {
          router.push("/login");
        }
        setAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const user = JSON.parse(userStr);

        // Final role safety check
        if (user.role !== "FINANCE_ADMIN" && user.role !== "SUPER_ADMIN") {
          localStorage.removeItem("nebiant_admin_token");
          localStorage.removeItem("nebiant_admin_user");
          router.push("/login");
          setAuthorized(false);

          return;
        }

        // Verify with backend
        await api.get("/sales-dashboard/dashboard");
        setAuthorized(true);
      } catch (error) {
        console.error("Auth verification failed", error);
        localStorage.removeItem("nebiant_admin_token");
        localStorage.removeItem("nebiant_admin_user");
        router.push("/login");
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    if (pathname === "/login") {
      setLoading(false);
      setAuthorized(true);
      return;
    }

    checkAuth();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
          <div className="relative w-24 h-24 bg-white rounded-[32px] shadow-2xl shadow-indigo-100 flex items-center justify-center p-5 transform transition-transform hover:scale-105 duration-500">
            <Image
              src="/logo.png"
              alt="10alytics Logo"
              width={64}
              height={64}
              className="object-contain animate-in zoom-in duration-500"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
            Validating Credentials
          </p>
        </div>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
