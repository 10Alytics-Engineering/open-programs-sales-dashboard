"use client";

import { ArrowLeft } from "lucide-react";

type PaymentDetailHeaderProps = {
  onBack: () => void;
};

export function PaymentDetailHeader({ onBack }: PaymentDetailHeaderProps) {
  return (
    <button
      onClick={onBack}
      className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to Transactions
    </button>
  );
}
