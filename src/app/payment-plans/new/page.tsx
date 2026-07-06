"use client";

import { Loader2 } from "lucide-react";
import { CreatePaymentPlanHeader } from "../components/create-payment-plan-header";
import { CreatePaymentPlanForm } from "../components/create-payment-plan-form";
import { CreatePaymentPlanPreview } from "../components/create-payment-plan-preview";
import { useCreatePaymentPlan } from "../hooks/use-create-payment-plan";

export default function NewPaymentPlanPage() {
  const workflow = useCreatePaymentPlan();

  if (workflow.loadingOptions) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <CreatePaymentPlanHeader
        submitting={workflow.submitting}
        canSubmit={workflow.canSubmit}
        onBack={workflow.handleBack}
        onSubmit={workflow.handleSubmit}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_24rem] gap-6">
        <CreatePaymentPlanForm workflow={workflow} />

        <CreatePaymentPlanPreview workflow={workflow} />
      </div>
    </div>
  );
}
