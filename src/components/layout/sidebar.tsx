"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  PieChart,
  Settings,
  LogOut,
  X,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: CreditCard, label: "Payments", href: "/payments" },
  { icon: Users, label: "Students", href: "/students" },
  { icon: PieChart, label: "Reports", href: "/reports" },
];

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col h-screen z-50 transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-10 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center p-2">
                <Image src="/logo.png" alt="Logo" width={32} height={32} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-black text-slate-900 leading-none uppercase tracking-tighter">Sales</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">10alytics</p>
              </div>
            </div>
            
            {/* Mobile Close Button */}
            <button 
              className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  pathname === item.href
                    ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5",
                  pathname === item.href ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                )} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

      <div className="mt-auto p-6 border-t border-slate-100 space-y-2">
        <button
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
          onClick={() => {
            localStorage.removeItem("nebiant_admin_token");
            window.location.href = "/login";
          }}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  </>
);
}
