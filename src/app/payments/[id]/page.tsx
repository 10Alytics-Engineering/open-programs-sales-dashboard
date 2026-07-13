"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { usePaymentPlanDetail } from "../hooks/use-payment-plan-detail";
import { usePaymentPlanActions } from "../hooks/use-payment-plan-actions";
import { PaymentPlanDetailHeader } from "../components/payment-plan-detail-header";
import { PaymentPlanSummaryCard } from "../components/payment-plan-summary-card";
import { PaymentPlanTabs } from "../components/payment-plan-tabs";

export default function PaymentPlanDetailPage() {
  const router = useRouter();
  const { plan, loading, refetch } = usePaymentPlanDetail();

  const actions = usePaymentPlanActions({
    paymentStatusId: plan?.id || "",
    onSuccess: refetch,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="rounded-3xl bg-white border border-slate-100 p-8 text-center">
        <p className="text-sm font-bold text-slate-400">
          Payment plan not found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PaymentPlanDetailHeader onBack={() => router.back()} />

      <PaymentPlanSummaryCard plan={plan} />

      <PaymentPlanTabs plan={plan} actions={actions} />
    </div>
  );
}
