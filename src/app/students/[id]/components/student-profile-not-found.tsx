"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function StudentProfileNotFound() {
  return (
    <div className="py-20 text-center">
      <p className="mb-4 font-bold text-slate-400">Student not found</p>

      <Link
        href="/students"
        className="flex items-center justify-center gap-2 font-bold text-indigo-600 hover:underline"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Directory
      </Link>
    </div>
  );
}
