"use client";

import { CheckCircle2, Loader2 } from "lucide-react";

import { formatDate, formatPrice } from "@/lib/utils";
import { CreatePaymentPlanPreviewRow } from "./create-payment-plan-preview-row";
import { CreatePaymentPlanWorkflow } from "../hooks/use-create-payment-plan";

type CreatePaymentPlanPreviewProps = {
  workflow: CreatePaymentPlanWorkflow;
};

export function CreatePaymentPlanPreview({
  workflow,
}: CreatePaymentPlanPreviewProps) {
  const {
    selectedUser,
    selectedCourse,
    selectedCohort,
    form,
    preview,
    previewLoading,
    submitting,
    canSubmit,
    handleSubmit,
  } = workflow;

  return (
    <div className="xl:sticky xl:top-6 h-fit">
      <div className="bg-slate-950 rounded-3xl p-5 md:p-6 text-white shadow-xl shadow-slate-200">
        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
          Payment Preview
        </p>

        <div className="mt-5 space-y-4">
          <CreatePaymentPlanPreviewRow
            label="User"
            value={selectedUser?.name || "Not selected"}
          />

          <CreatePaymentPlanPreviewRow
            label="Course"
            value={selectedCourse?.title || "Not selected"}
          />

          <CreatePaymentPlanPreviewRow
            label="Cohort"
            value={selectedCohort?.name || "Not selected"}
          />

          <CreatePaymentPlanPreviewRow
            label="Plan"
            value={
              form.planType ? form.planType.replace(/_/g, " ") : "Not selected"
            }
          />
        </div>

        <div className="mt-6 rounded-3xl bg-white/10 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Expected Amount
          </p>

          {previewLoading ? (
            <div className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-300">
              <Loader2 className="w-4 h-4 animate-spin" />
              Calculating...
            </div>
          ) : (
            <p className="text-2xl font-black mt-2">
              {preview ? formatPrice(preview.expectedAmount) : "₦0"}
            </p>
          )}
        </div>

        <CreatePaymentPlanInstallmentPreview
          preview={preview}
          previewLoading={previewLoading}
        />

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-slate-950 transition hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <CheckCircle2 className="w-5 h-5" />
          )}
          Confirm & Create Plan
        </button>
      </div>
    </div>
  );
}

function CreatePaymentPlanInstallmentPreview({
  preview,
  previewLoading,
}: {
  preview: CreatePaymentPlanWorkflow["preview"];
  previewLoading: boolean;
}) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Installment Breakdown
        </p>

        {preview?.installments?.length ? (
          <span className="text-[10px] font-black text-indigo-300">
            {preview.installments.length} total
          </span>
        ) : null}
      </div>

      {previewLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-16 rounded-2xl bg-white/10 animate-pulse"
            />
          ))}
        </div>
      ) : preview?.installments?.length ? (
        <div className="space-y-3">
          {preview.installments.map((installment) => (
            <div
              key={installment.installmentNumber}
              className="rounded-2xl bg-white/10 p-4 flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-sm font-black">
                  Installment #{installment.installmentNumber}
                </p>

                <p className="text-[10px] font-bold text-slate-400 mt-1">
                  Due {formatDate(installment.dueDate)}
                </p>
              </div>

              <p className="text-sm font-black">
                {formatPrice(installment.amount)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-sm font-bold text-slate-300">
            No installments. This is treated as a one-time payment plan.
          </p>
        </div>
      )}
    </div>
  );
}
