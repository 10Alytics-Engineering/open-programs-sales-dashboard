import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { formatDate } from "@/lib/utils";
import { PaymentPlanRecord } from "@/types";
import { PaymentPlanStateBadge } from "./payment-plan-state-badge";
import { PaymentPlanTableLoader } from "./payment-plan-table-loader";
import { PaymentPlanEmptyState } from "./payment-plan-empty-state";
import { PaymentPlanCollectionBadge } from "./payment-plan-collection-badge";

type PaymentPlansTableProps = {
  paymentPlans: PaymentPlanRecord[];
  loading: boolean;
  wrapper?: boolean;
};

export function PaymentPlansTable({
  paymentPlans,
  loading,
  wrapper,
}: PaymentPlansTableProps) {
  const table = (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-225">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <PaymentPlansTableHead>User</PaymentPlansTableHead>
            <PaymentPlansTableHead>Course</PaymentPlansTableHead>
            <PaymentPlansTableHead>Plan</PaymentPlansTableHead>
            <PaymentPlansTableHead>Status</PaymentPlansTableHead>
            <PaymentPlansTableHead>Date</PaymentPlansTableHead>
            <PaymentPlansTableHead align="right">Action</PaymentPlansTableHead>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {loading ? (
            <PaymentPlanTableLoader />
          ) : paymentPlans.length === 0 ? (
            <PaymentPlanEmptyState />
          ) : (
            paymentPlans.map((plan) => (
              <PaymentPlansTableRow key={plan.id} plan={plan} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  if (!wrapper) return table;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
      {table}
    </div>
  );
}

function PaymentPlansTableHead({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest ${
        align === "right" ? "text-right" : ""
      }`}
    >
      {children}
    </th>
  );
}

function PaymentPlansTableRow({ plan }: { plan: PaymentPlanRecord }) {
  return (
    <tr className="hover:bg-indigo-50/30 transition-colors group">
      <td className="px-6 py-5">
        <p className="text-sm font-bold text-slate-900">
          {plan.user?.name || "Unknown User"}
        </p>

        <p className="text-[10px] text-slate-400 font-medium">
          {plan.user?.email || "No email"}
        </p>
      </td>

      <td className="px-6 py-5">
        <p className="text-xs font-bold text-slate-700 max-w-55 truncate">
          {plan.course?.title || "N/A"}
        </p>

        <p className="text-[10px] text-slate-400 font-bold">
          {plan.cohort?.name || "No cohort"}
        </p>
      </td>

      <td className="px-6 py-5">
        <p className="text-[10px] font-black text-indigo-600 uppercase">
          {plan.paymentPlan?.replace(/_/g, " ") || "N/A"}
        </p>

        {/* <p className="text-[10px] text-slate-400 font-bold">
          {plan.installmentSummary.total > 0
            ? `${plan.installmentSummary.paid}/${plan.installmentSummary.total} installments`
            : "One-time"}
        </p> */}
      </td>

      <td className="px-6 py-5">
        <PaymentPlanCollectionBadge
          status={plan.collectionStatus}
          days={plan.maxOverdueDays}
        />
      </td>

      <td className="px-6 py-5 text-[11px] font-bold text-slate-500">
        {formatDate(plan.createdAt)}
      </td>

      <td className="px-6 py-5 text-right">
        <Link
          href={`/payment-plans/${plan.id}`}
          className="inline-flex items-center justify-end gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
        >
          Details
          <ChevronRight className="w-4 h-4" />
        </Link>
      </td>
    </tr>
  );
}
