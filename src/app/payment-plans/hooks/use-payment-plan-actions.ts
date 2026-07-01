"use client";

import {
  addManualPayment,
  AddManualPaymentPayload,
  addPaymentTransaction,
  AddPaymentTransactionPayload,
  markPaymentTransactionPaid,
  MarkPaymentTransactionPaidPayload,
  updateInstallmentDueDate,
  UpdateInstallmentDueDatePayload,
} from "@/app/services/payment-plan-actions";
import { useState } from "react";
import { toast } from "sonner";

type UsePaymentPlanActionsProps = {
  paymentStatusId: string;
  onSuccess?: () => Promise<void> | void;
};

export function usePaymentPlanActions({
  paymentStatusId,
  onSuccess,
}: UsePaymentPlanActionsProps) {
  const [updatingInstallmentId, setUpdatingInstallmentId] = useState<
    string | null
  >(null);
  const [addingTransaction, setAddingTransaction] = useState(false);
  const [addingManualPayment, setAddingManualPayment] = useState(false);
  const [markingPaidTransactionId, setMarkingPaidTransactionId] = useState<
    string | null
  >(null);

  const handleUpdateInstallmentDueDate = async (
    installmentId: string,
    payload: UpdateInstallmentDueDatePayload,
  ) => {
    setUpdatingInstallmentId(installmentId);

    try {
      await updateInstallmentDueDate(installmentId, payload);
      toast.success("Installment due date updated");
      await onSuccess?.();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.error || "Failed to update installment due date",
      );
    } finally {
      setUpdatingInstallmentId(null);
    }
  };

  const handleAddPaymentTransaction = async (
    payload: AddPaymentTransactionPayload,
  ) => {
    setAddingTransaction(true);

    try {
      await addPaymentTransaction(paymentStatusId, payload);
      toast.success("Payment transaction added");
      await onSuccess?.();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.error || "Failed to add payment transaction",
      );
    } finally {
      setAddingTransaction(false);
    }
  };

  const handleMarkTransactionPaid = async (
    transactionId: string,
    payload: MarkPaymentTransactionPaidPayload,
  ) => {
    setMarkingPaidTransactionId(transactionId);

    try {
      await markPaymentTransactionPaid(transactionId, payload);
      toast.success("Transaction marked as paid");
      await onSuccess?.();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.error || "Failed to mark transaction as paid",
      );
    } finally {
      setMarkingPaidTransactionId(null);
    }
  };

  const handleAddManualPayment = async (payload: AddManualPaymentPayload) => {
    setAddingManualPayment(true);

    try {
      await addManualPayment(paymentStatusId, payload);
      toast.success(
        payload.markPaid
          ? "Manual payment added and marked as paid"
          : "Manual payment added",
      );
      await onSuccess?.();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.error || "Failed to add manual payment",
      );
    } finally {
      setAddingManualPayment(false);
    }
  };

  return {
    updatingInstallmentId,
    addingTransaction,
    addingManualPayment,
    markingPaidTransactionId,

    handleUpdateInstallmentDueDate,
    handleAddPaymentTransaction,
    handleMarkTransactionPaid,
    handleAddManualPayment,
  };
}
