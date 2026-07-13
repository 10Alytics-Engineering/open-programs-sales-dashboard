import { BookOpen, CalendarClock, CreditCard } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import { PaymentPlanRecord } from "@/types";
import { PaymentPlanMetric } from "./payment-plan-metric";
import { PaymentPlanStateBadge } from "./payment-plan-state-badge";
import { PaymentPlanCollectionBadge } from "./payment-plan-collection-badge";
import { formatPaymentPlanAmount } from "@/lib/payment-helpers";

type PaymentPlanSummaryCardProps = {
  plan: PaymentPlanRecord;
};

export function PaymentPlanSummaryCard({ plan }: PaymentPlanSummaryCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="space-y-4">
          <PaymentPlanCollectionBadge
            status={plan.collectionStatus}
            days={plan.maxOverdueDays}
          />

          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">
              {plan.user?.name || "Unknown User"}
            </h1>

            <p className="text-sm font-bold text-slate-500 mt-1">
              {plan.user?.email || "No email available"}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-xs font-bold text-slate-500">
            <span className="inline-flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {plan.course?.title || "N/A"}
            </span>

            <span className="inline-flex items-center gap-2">
              <CalendarClock className="w-4 h-4" />
              {plan.cohort?.name || "No cohort"}
            </span>

            <span className="inline-flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              {plan.paymentPlan?.replace(/_/g, " ") || "N/A"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full lg:w-auto">
          <PaymentPlanMetric
            label="Expected"
            value={formatPaymentPlanAmount(plan, "expectedAmount")}
          />

          <PaymentPlanMetric
            label="Collected"
            value={formatPaymentPlanAmount(plan, "paidAmount")}
          />

          <PaymentPlanMetric
            label="Outstanding"
            value={formatPaymentPlanAmount(plan, "pendingAmount")}
          />

          <PaymentPlanMetric
            label="Overdue"
            value={formatPaymentPlanAmount(plan, "overdueAmount")}
          />
        </div>
      </div>
    </div>
  );
}
