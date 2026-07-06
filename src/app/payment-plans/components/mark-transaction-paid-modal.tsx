"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import { Transaction } from "@/types";

type MarkTransactionPaidModalProps = {
  open: boolean;
  transaction: Transaction | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: { paymentDate?: string; reason?: string }) => void;
};

export function MarkTransactionPaidModal({
  open,
  transaction,
  loading,
  onClose,
  onSubmit,
}: MarkTransactionPaidModalProps) {
  const [paymentDate, setPaymentDate] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) return;

    setPaymentDate(new Date().toISOString().slice(0, 10));
    setReason("");
  }, [open]);

  if (!open || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Mark Transaction as Paid
            </h3>
            <p className="text-xs font-bold text-slate-400 mt-1">
              {transaction.transactionRef || "No reference"} ·{" "}
              {formatPrice(transaction.amount)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
            <p className="text-sm font-black text-slate-900">
              This action will process the transaction as a successful payment.
            </p>
            <p className="text-xs font-bold text-slate-500 mt-1">
              It can update installments, payment status, purchase/access
              records, notifications, and related finance records.
            </p>
          </div>

          <label className="block space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
              Payment Date
            </span>
            <input
              type="date"
              value={paymentDate}
              onChange={(event) => setPaymentDate(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
              Reason / Note
            </span>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={3}
              placeholder="Why is this being marked manually?"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
            />
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
            onClick={() => onSubmit({ paymentDate, reason })}
            disabled={loading}
            className="px-5 py-3 rounded-2xl text-sm font-black bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Confirm Paid
          </button>
        </div>
      </div>
    </div>
  );
}
