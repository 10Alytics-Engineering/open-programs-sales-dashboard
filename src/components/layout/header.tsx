"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { User } from "@/types";
import { Menu } from "lucide-react";

export default function Header({
  onOpenSidebar,
}: {
  onOpenSidebar?: () => void;
}) {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const userStr = localStorage.getItem("nebiant_admin_user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user info");
      }
    }
  }, []);

  if (pathname === "/login") return null;

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider hidden sm:block">
          Business Overview
        </h2>
      </div>
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex flex-col items-end">
          <span className="text-sm font-bold text-slate-900 leading-tight">
            {user?.name || "Admin User"}
          </span>
          <span className="text-[10px] text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full capitalize">
            {user?.role?.replace(/_/g, " ") || "Course Admin"}
          </span>
        </div>
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 border-2 border-white shadow-sm shadow-indigo-100 flex items-center justify-center text-white font-black text-xs">
          {user?.name?.substring(0, 1).toUpperCase() || "A"}
        </div>
      </div>
    </header>
  );
}
