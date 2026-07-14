"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Plus } from "lucide-react";

import { formatDate } from "@/lib/utils";
import { PaymentPlanRecord, Transaction } from "@/types";
import { usePaymentPlanActions } from "../hooks/use-payment-plan-actions";
import { AddPaymentTransactionModal } from "./add-payment-transaction-modal";
import { MarkTransactionPaidModal } from "./mark-transaction-paid-modal";

type PaymentTransactionsTabProps = {
  plan: PaymentPlanRecord;
  transactions: Transaction[];
  actions: ReturnType<typeof usePaymentPlanActions>;
};

export function PaymentTransactionsTab({
  plan,
  transactions,
  actions,
}: PaymentTransactionsTabProps) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Payment Transactions
            </h3>
            <p className="text-xs font-bold text-slate-400 mt-1">
              Transactions tied to this payment plan.
            </p>
          </div>

          <button
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-black text-white hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>

        {!transactions.length ? (
          <p className="text-sm font-bold text-slate-400 text-center py-10">
            No transactions linked to this payment plan.
          </p>
        ) : (
          transactions.map((transaction) => (
            <PaymentTransactionCard
              key={`${transaction.source}-${transaction.id}`}
              transaction={transaction}
              isMarkingPaid={
                actions.markingPaidTransactionId === transaction.id
              }
              onMarkPaid={() => setSelectedTransaction(transaction)}
            />
          ))
        )}
      </div>

      <AddPaymentTransactionModal
        open={addModalOpen}
        plan={plan}
        loading={actions.addingManualPayment}
        onClose={() => setAddModalOpen(false)}
        onSubmit={async (payload) => {
          await actions.handleAddManualPayment({
            amount: payload.amount,
            installmentNumber: payload.installmentNumber,
            paymentDate: payload.paymentDate,
            reference: payload.transactionRef,
            notes: payload.notes,
            markPaid: payload.markPaid,
            currency: payload.currency,
          });

          setAddModalOpen(false);
        }}
      />

      <MarkTransactionPaidModal
        open={!!selectedTransaction}
        transaction={selectedTransaction}
        loading={
          selectedTransaction
            ? actions.markingPaidTransactionId === selectedTransaction.id
            : false
        }
        onClose={() => setSelectedTransaction(null)}
        onSubmit={async (payload) => {
          if (!selectedTransaction) return;

          await actions.handleMarkTransactionPaid(selectedTransaction.id, {
            paymentDate: payload.paymentDate,
            reason: payload.reason,
          });

          setSelectedTransaction(null);
        }}
      />
    </>
  );
}

function PaymentTransactionCard({
  transaction,
  isMarkingPaid,
  onMarkPaid,
}: {
  transaction: Transaction;
  isMarkingPaid: boolean;
  onMarkPaid: () => void;
}) {
  const transactionDate = transaction.paymentDate || transaction.createdAt;
  const isPaid = transaction.status === "success";

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl border border-slate-100 hover:bg-indigo-50/30 transition">
      <Link
        href={`/payments/${transaction.id}?source=${transaction.source || "unified"}`}
        className="min-w-0"
      >
        <p className="text-sm font-black text-slate-900 truncate">
          {transaction.transactionRef || "No reference"}
        </p>

        <p className="text-xs font-bold text-slate-400">
          {transactionDate ? formatDate(transactionDate) : "No date available"}
        </p>

        <p className="text-[10px] font-black text-indigo-500 uppercase mt-1">
          {transaction.paymentGateway || transaction.source || "Unknown source"}
        </p>
      </Link>

      <div className="flex flex-wrap items-center gap-4">
        <p className="text-lg font-black text-slate-900">
          {transaction.displayAmountFormatted}
        </p>

        <span className="text-[10px] font-black uppercase text-indigo-600">
          {transaction.status}
        </span>

        {!isPaid && (
          <button
            onClick={onMarkPaid}
            disabled={isMarkingPaid}
            className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
          >
            <CheckCircle2 className="w-3 h-3" />
            Mark Paid
          </button>
        )}
      </div>
    </div>
  );
}
