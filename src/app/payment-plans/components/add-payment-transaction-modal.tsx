"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, X } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import { PaymentPlanRecord } from "@/types";

type AddPaymentTransactionModalProps = {
  open: boolean;
  plan: PaymentPlanRecord;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    amount: number;
    paymentGateway: "PAYSTACK" | "STRIPE" | "START_BUTTON";
    transactionRef?: string;
    installmentNumber?: number;
    paymentDate?: string;
    notes?: string;
    markPaid: boolean;
  }) => void;
};

export function AddPaymentTransactionModal({
  open,
  plan,
  loading,
  onClose,
  onSubmit,
}: AddPaymentTransactionModalProps) {
  const firstUnpaidInstallment = useMemo(() => {
    return plan.paymentInstallments?.find((installment) => !installment.paid);
  }, [plan.paymentInstallments]);

  const isInstallmentPlan = Boolean(plan.paymentInstallments?.length);

  const [amount, setAmount] = useState("");
  const [paymentGateway, setPaymentGateway] = useState<
    "PAYSTACK" | "STRIPE" | "START_BUTTON"
  >("START_BUTTON");
  const [transactionRef, setTransactionRef] = useState("");
  const [installmentNumber, setInstallmentNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [notes, setNotes] = useState("");
  const [markPaid, setMarkPaid] = useState(true);

  useEffect(() => {
    if (!open) return;

    setPaymentGateway("START_BUTTON");
    setTransactionRef("");
    setPaymentDate(new Date().toISOString().slice(0, 10));
    setNotes("");
    setMarkPaid(true);

    if (firstUnpaidInstallment) {
      setInstallmentNumber(String(firstUnpaidInstallment.installmentNumber));
      setAmount(String(firstUnpaidInstallment.amount));
    } else {
      setInstallmentNumber("");
      setAmount(String(plan.totals?.pendingAmount || ""));
    }
  }, [open, firstUnpaidInstallment, plan.totals?.pendingAmount]);

  const selectedInstallment = plan.paymentInstallments?.find(
    (installment) =>
      installment.installmentNumber === Number(installmentNumber),
  );

  useEffect(() => {
    if (!selectedInstallment) return;
    setAmount(String(selectedInstallment.amount));
  }, [selectedInstallment]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Add Payment Transaction
            </h3>
            <p className="text-xs font-bold text-slate-400 mt-1">
              Add a transaction under this payment plan.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {isInstallmentPlan && (
            <label className="block space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                Installment
              </span>
              <select
                value={installmentNumber}
                onChange={(event) => setInstallmentNumber(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
              >
                <option value="">Select installment</option>
                {plan.paymentInstallments?.map((installment) => (
                  <option
                    key={installment.id}
                    value={installment.installmentNumber}
                    disabled={installment.paid}
                  >
                    #{installment.installmentNumber} —{" "}
                    {formatPrice(installment.amount)}
                    {installment.paid ? " — Paid" : ""}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="block space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
              Amount
            </span>
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              type="number"
              min="0"
              placeholder="Amount"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
              Gateway / Source
            </span>
            <select
              value={paymentGateway}
              onChange={(event) => setPaymentGateway(event.target.value as any)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
            >
              <option value="START_BUTTON">Start Button</option>
              <option value="PAYSTACK">Paystack</option>
              <option value="STRIPE">Stripe</option>
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
              Reference
            </span>
            <input
              value={transactionRef}
              onChange={(event) => setTransactionRef(event.target.value)}
              placeholder="Leave empty to auto-generate"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
              Payment Date
            </span>
            <input
              value={paymentDate}
              onChange={(event) => setPaymentDate(event.target.value)}
              type="date"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
            />
          </label>

          <label className="md:col-span-2 block space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
              Notes
            </span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              placeholder="Add finance note..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
            />
          </label>

          <label className="md:col-span-2 flex items-start gap-3 rounded-2xl bg-amber-50 border border-amber-100 p-4 cursor-pointer">
            <input
              type="checkbox"
              checked={markPaid}
              onChange={(event) => setMarkPaid(event.target.checked)}
              className="mt-1"
            />
            <span>
              <span className="block text-sm font-black text-slate-900">
                Mark as paid immediately
              </span>
              <span className="block text-xs font-bold text-slate-500 mt-1">
                This will update the transaction, installment, payment plan,
                purchase/access records, and related side effects.
              </span>
            </span>
          </label>
        </div>

        <div className="px-6 py-5 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-3 rounded-2xl text-sm font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onSubmit({
                amount: Number(amount),
                paymentGateway,
                transactionRef: transactionRef || undefined,
                installmentNumber: installmentNumber
                  ? Number(installmentNumber)
                  : undefined,
                paymentDate: paymentDate || undefined,
                notes,
                markPaid,
              })
            }
            disabled={loading || !amount || Number(amount) <= 0}
            className="px-5 py-3 rounded-2xl text-sm font-black bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Add Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
