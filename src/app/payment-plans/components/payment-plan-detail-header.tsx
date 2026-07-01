"use client";

import { ArrowLeft } from "lucide-react";

type PaymentPlanDetailHeaderProps = {
  onBack: () => void;
};

export function PaymentPlanDetailHeader({
  onBack,
}: PaymentPlanDetailHeaderProps) {
  return (
    <button
      onClick={onBack}
      className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm transition"
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </button>
  );
}
