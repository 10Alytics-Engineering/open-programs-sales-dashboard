"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

export default function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 min-w-0">
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
