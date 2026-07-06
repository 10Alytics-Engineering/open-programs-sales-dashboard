"use client";

import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

type CreatePaymentPlanHeaderProps = {
  submitting: boolean;
  canSubmit: boolean;
  onBack: () => void;
  onSubmit: () => void;
};

export function CreatePaymentPlanHeader({
  submitting,
  canSubmit,
  onBack,
  onSubmit,
}: CreatePaymentPlanHeaderProps) {
  return (
    <>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">
            Add Payment Plan
          </h1>

          <p className="text-sm text-slate-500 font-medium mt-1">
            Assign a course payment plan to a user and generate installments
            from the selected pricing plan.
          </p>
        </div>

        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <CheckCircle2 className="w-5 h-5" />
          )}
          Create Plan
        </button>
      </div>
    </>
  );
}
