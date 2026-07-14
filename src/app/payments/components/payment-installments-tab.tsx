"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Pencil } from "lucide-react";

import { cn, formatDate, formatPrice } from "@/lib/utils";
import { PaymentInstallment } from "@/types";
import { usePaymentPlanActions } from "../hooks/use-payment-plan-actions";
import { EditInstallmentDueDateModal } from "./edit-installment-due-date-modal";
import { formatMoneyAmount } from "@/lib/payment-helpers";

type PaymentInstallmentsTabProps = {
  installments: PaymentInstallment[];
  actions: ReturnType<typeof usePaymentPlanActions>;
};

export function PaymentInstallmentsTab({
  installments,
  actions,
}: PaymentInstallmentsTabProps) {
  const [selectedInstallment, setSelectedInstallment] =
    useState<PaymentInstallment | null>(null);

  if (!installments.length) {
    return (
      <p className="text-sm font-bold text-slate-400 text-center py-10">
        No installments for this payment plan.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {installments.map((installment) => (
          <PaymentInstallmentCard
            key={installment.id}
            installment={installment}
            isUpdating={actions.updatingInstallmentId === installment.id}
            onEditDueDate={() => setSelectedInstallment(installment)}
          />
        ))}
      </div>

      <EditInstallmentDueDateModal
        open={!!selectedInstallment}
        installment={selectedInstallment}
        loading={
          selectedInstallment
            ? actions.updatingInstallmentId === selectedInstallment.id
            : false
        }
        onClose={() => setSelectedInstallment(null)}
        onSubmit={async (payload) => {
          if (!selectedInstallment) return;

          await actions.handleUpdateInstallmentDueDate(
            selectedInstallment.id,
            payload,
          );

          setSelectedInstallment(null);
        }}
      />
    </>
  );
}

function PaymentInstallmentCard({
  installment,
  isUpdating,
  onEditDueDate,
}: {
  installment: PaymentInstallment;
  isUpdating: boolean;
  onEditDueDate: () => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl border",
        installment.paid
          ? "bg-emerald-50/40 border-emerald-100"
          : "bg-slate-50 border-slate-100",
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "w-10 h-10 rounded-2xl flex items-center justify-center font-black",
            installment.paid
              ? "bg-emerald-100 text-emerald-700"
              : "bg-white text-slate-400 border border-slate-200",
          )}
        >
          {installment.installmentNumber}
        </div>

        <div>
          <p className="text-sm font-black text-slate-900">
            Installment #{installment.installmentNumber}
          </p>

          <p className="text-xs font-bold text-slate-400">
            Due {formatDate(installment.dueDate)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between md:justify-end gap-3">
        <p className="text-lg font-black text-slate-900">
          {installment?.displayAmountFormatted ||
            formatMoneyAmount(
              installment.displayAmount ?? installment.amount,
              installment.displayCurrency,
            )}
        </p>

        <span
          className={cn(
            "inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase",
            installment.paid
              ? "bg-emerald-100 text-emerald-700"
              : "bg-white text-slate-500",
          )}
        >
          {installment.paid ? (
            <>
              <CheckCircle2 className="w-3 h-3" />
              Paid
            </>
          ) : (
            <>
              <Clock className="w-3 h-3" />
              Pending
            </>
          )}
        </span>

        {!installment.paid && (
          <button
            onClick={onEditDueDate}
            disabled={isUpdating}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
          >
            <Pencil className="w-3 h-3" />
            Edit Due Date
          </button>
        )}
      </div>
    </div>
  );
}
