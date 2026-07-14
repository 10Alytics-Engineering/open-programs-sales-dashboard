import api from "@/lib/axios";

export type UpdateInstallmentDueDatePayload = {
  dueDate: string;
  reason?: string;
  updatedBy?: string;
};

export type AddPaymentTransactionPayload = {
  amount: number;
  transactionRef?: string;
  installmentNumber?: number;
  paymentDate?: string;
  notes?: string;
  createdBy?: string;
  currency?: string;
};

export type MarkPaymentTransactionPaidPayload = {
  markedBy?: string;
  reason?: string;
  paymentDate?: string;
};

export type AddManualPaymentPayload = {
  amount: number;
  currency?: string;
  installmentNumber?: number;
  paymentDate?: string;
  reference?: string;
  notes?: string;
  createdBy?: string;
  markPaid?: boolean;
};

export async function updateInstallmentDueDate(
  installmentId: string,
  payload: UpdateInstallmentDueDatePayload,
) {
  const response = await api.patch(
    `/admin/payment-installments/${installmentId}/due-date`,
    payload,
  );

  return response.data;
}

export async function addPaymentTransaction(
  paymentStatusId: string,
  payload: AddPaymentTransactionPayload,
) {
  const response = await api.post(
    `/admin/payment-statuses/${paymentStatusId}/transactions`,
    payload,
  );

  return response.data;
}

export async function markPaymentTransactionPaid(
  transactionId: string,
  payload: MarkPaymentTransactionPaidPayload,
) {
  const response = await api.post(
    `/admin/payment-transactions/${transactionId}/mark-paid`,
    payload,
  );

  return response.data;
}

export async function addManualPayment(
  paymentStatusId: string,
  payload: AddManualPaymentPayload,
) {
  const response = await api.post(
    `/admin/payment-statuses/${paymentStatusId}/manual-payment`,
    payload,
  );

  return response.data;
}
