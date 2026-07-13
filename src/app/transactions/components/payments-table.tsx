import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { formatDate } from "@/lib/utils";
import { Transaction } from "@/types";
import { PaymentGatewayBadge } from "./payment-gateway-badge";
import { PaymentTransactionStatusBadge } from "./payment-transaction-status-badge";
import { PaymentsTableLoader } from "./payments-table-loader";
import { PaymentsEmptyState } from "./payments-empty-state";
import { formatTransactionAmount } from "@/lib/payment-helpers";

type PaymentsTableProps = {
  payments: Transaction[];
  loading: boolean;
};

export function PaymentsTable({ payments, loading }: PaymentsTableProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <table className="w-full text-left border-collapse min-w-225">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <TableHead>Payer</TableHead>
            <TableHead>Transaction</TableHead>
            <TableHead>Gateway</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead align="right">Action</TableHead>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {loading ? (
            <PaymentsTableLoader />
          ) : payments.length === 0 ? (
            <PaymentsEmptyState />
          ) : (
            payments.map((payment) => (
              <PaymentsTableRow
                key={`${payment.source}-${payment.id}`}
                payment={payment}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function TableHead({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-4 md:px-6 py-4 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest ${
        align === "right" ? "text-right" : ""
      }`}
    >
      {children}
    </th>
  );
}

function PaymentsTableRow({ payment }: { payment: Transaction }) {
  const user = payment.paymentStatus?.user;
  const course = payment.paymentStatus?.course;

  const gateway =
    payment.paymentGateway ||
    (payment.source === "paystack" ? "PAYSTACK" : undefined);

  return (
    <tr className="hover:bg-indigo-50/30 transition-colors group">
      <td className="px-4 md:px-6 py-4 md:py-5">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition">
            {user?.name || "Unknown User"}
          </span>

          <span className="text-[10px] text-slate-400 font-medium truncate max-w-48">
            {user?.email || "No email"}
          </span>

          {user?.phone_number && (
            <span className="text-[10px] text-slate-500 font-medium truncate max-w-48 mt-0.5">
              {user.phone_number}
            </span>
          )}
        </div>
      </td>

      <td className="px-4 md:px-6 py-4 md:py-5">
        <div className="flex flex-col">
          <span className="text-xs font-black text-slate-800 truncate max-w-56">
            {payment.transactionRef || "No reference"}
          </span>

          <span className="text-[10px] font-bold text-slate-400 truncate max-w-56">
            {course?.title || "No course attached"}
          </span>
        </div>
      </td>

      <td className="px-4 md:px-6 py-4 md:py-5">
        <PaymentGatewayBadge gateway={gateway} source={payment.source} />
      </td>

      <td className="px-4 md:px-6 py-4 md:py-5">
        <span className="text-sm font-black text-slate-900 whitespace-nowrap">
          {formatTransactionAmount(payment)}
        </span>
      </td>

      <td className="px-4 md:px-6 py-4 md:py-5">
        <PaymentTransactionStatusBadge status={payment.status} />
      </td>

      <td className="px-4 md:px-6 py-4 md:py-5 whitespace-nowrap">
        <span className="text-[11px] font-bold text-slate-500">
          {payment.paymentDate
            ? formatDate(payment.paymentDate)
            : formatDate(payment.createdAt)}
        </span>
      </td>

      <td className="px-4 md:px-6 py-4 md:py-5 text-right">
        <Link
          href={`/payments/${payment.id}?source=${payment.source || "unified"}`}
          className="inline-flex items-center justify-end gap-1 text-[10px] md:text-xs font-bold text-indigo-600 hover:text-indigo-800 transition whitespace-nowrap"
        >
          <span className="hidden sm:inline">Details</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </td>
    </tr>
  );
}
