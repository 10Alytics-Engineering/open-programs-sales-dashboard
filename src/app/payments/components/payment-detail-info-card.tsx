import Link from "next/link";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PaymentDetailInfoCardProps = {
  icon: ReactNode;
  title: string;
  lines: Array<string | null | undefined>;
  tone?: "indigo" | "violet" | "emerald";
  link?: {
    label: string;
    href: string;
  };
};

export function PaymentDetailInfoCard({
  icon,
  title,
  lines,
  tone = "indigo",
  link,
}: PaymentDetailInfoCardProps) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex gap-4">
      <div
        className={cn(
          "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0",
          tone === "indigo" && "bg-indigo-100 text-indigo-600",
          tone === "violet" && "bg-violet-100 text-violet-600",
          tone === "emerald" && "bg-emerald-100 text-emerald-600",
        )}
      >
        {icon}
      </div>

      <div className="space-y-1 min-w-0">
        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
          {title}
        </p>

        {lines.filter(Boolean).map((line, index) => (
          <p
            key={`${line}-${index}`}
            className={cn(
              index === 0
                ? "text-base md:text-lg font-black text-slate-900 leading-tight"
                : "text-[10px] md:text-sm font-bold text-slate-500",
              "wrap-break-word",
            )}
          >
            {line}
          </p>
        ))}

        {link && (
          <Link
            href={link.href}
            target="_blank"
            className="inline-flex text-xs font-black text-indigo-600 hover:text-indigo-800 mt-2"
          >
            {link.label}
          </Link>
        )}
      </div>
    </div>
  );
}
