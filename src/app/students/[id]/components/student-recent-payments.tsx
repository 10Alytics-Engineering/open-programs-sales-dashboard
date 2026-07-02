"use client";

import { History } from "lucide-react";

import { formatDate, formatPrice } from "@/lib/utils";
import { Transaction } from "@/types";

type StudentRecentPaymentsProps = {
  transactions: Transaction[];
};

export function StudentRecentPayments({
  transactions,
}: StudentRecentPaymentsProps) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:rounded-4xl md:p-8">
      <h4 className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
        <History className="h-3.5 w-3.5 text-indigo-500" />
        Recent Payments
      </h4>

      <div className="space-y-6">
        {transactions.slice(0, 5).map((transaction) => (
          <div key={transaction.id} className="group flex gap-4">
            <div className="relative">
              <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-indigo-500" />
              <div className="absolute bottom-0 left-[4.5px] top-4 w-px bg-slate-100 group-last:hidden" />
            </div>

            <div>
              <p className="text-xs font-black leading-tight text-slate-900">
                Payment of {formatPrice(Number(transaction.amount || 0))}
              </p>

              <p className="text-[10px] font-bold text-slate-400">
                {transaction.paymentDate
                  ? formatDate(transaction.paymentDate)
                  : "No date"}
              </p>
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <p className="text-center text-xs font-bold italic text-slate-300">
            No recent payments
          </p>
        )}
      </div>
    </div>
  );
}
