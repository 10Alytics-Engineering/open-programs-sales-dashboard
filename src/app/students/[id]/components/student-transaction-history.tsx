"use client";

import { CreditCard } from "lucide-react";

import { cn, formatDate, formatPrice } from "@/lib/utils";
import { Transaction } from "@/types";
import { formatTransactionAmount } from "@/lib/payment-helpers";

type StudentTransactionHistoryProps = {
  transactions: Transaction[];
};

export function StudentTransactionHistory({
  transactions,
}: StudentTransactionHistoryProps) {
  if (transactions.length === 0) return null;

  return (
    <div className="space-y-6 pb-20">
      <h2 className="flex items-center gap-2 text-xl font-black uppercase tracking-tighter text-slate-900">
        <CreditCard className="h-5 w-5 text-indigo-600" />
        Transaction History
      </h2>

      <div className="overflow-hidden rounded-4xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full min-w-150 text-left md:min-w-0">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                <TableHead>Reference</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="transition-colors hover:bg-slate-50/50"
                >
                  <TableCell className="font-bold uppercase tracking-tighter text-slate-600">
                    {transaction.transactionRef}
                  </TableCell>

                  <TableCell>
                    <span className="inline-block max-w-50 truncate text-xs font-black uppercase tracking-tighter text-slate-900">
                      {transaction.paymentStatus?.course?.title ||
                        "Program Payment"}
                    </span>
                  </TableCell>

                  <TableCell className="font-black text-slate-900">
                    {formatTransactionAmount(transaction)}
                  </TableCell>

                  <TableCell>
                    <span
                      className={cn(
                        "rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-wider",
                        transaction.status === "success"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600",
                      )}
                    >
                      {transaction.status}
                    </span>
                  </TableCell>

                  <TableCell className="font-bold text-slate-400">
                    {transaction.paymentDate
                      ? formatDate(transaction.paymentDate)
                      : "N/A"}
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 md:px-6 md:py-4 md:text-[10px]">
      {children}
    </th>
  );
}

function TableCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td
      className={cn(
        "px-4 py-3 text-[10px] md:px-6 md:py-4 md:text-xs",
        className,
      )}
    >
      {children}
    </td>
  );
}
