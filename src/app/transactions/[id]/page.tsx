"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { usePaymentDetail } from "../hooks/use-payment-detail";
import { PaymentDetailHeader } from "../components/payment-detail-header";
import { PaymentDetailHero } from "../components/payment-detail-hero";
import { PaymentDetailInfoGrid } from "../components/payment-detail-info-grid";
import { PaymentInstallmentContextCard } from "../components/payment-installment-context-card";
import { PaymentTransactionMetadataCard } from "../components/payment-transaction-metadata-card";
import { PaymentManualContextCard } from "../components/payment-manual-context-card";

export default function PaymentDetailPage() {
  const router = useRouter();
  const { payment, loading, metadata } = usePaymentDetail();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="rounded-3xl bg-white border border-slate-100 p-8 text-center">
        <p className="text-sm font-bold text-slate-400">
          Payment record not found.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <PaymentDetailHeader onBack={() => router.back()} />

      <PaymentDetailHero payment={payment} metadata={metadata} />

      <PaymentManualContextCard metadata={metadata} />

      <PaymentDetailInfoGrid payment={payment} />

      {payment.isInstallmentPayment && payment.matchedInstallment && (
        <PaymentInstallmentContextCard
          installment={payment.matchedInstallment}
        />
      )}

      <PaymentTransactionMetadataCard payment={payment} metadata={metadata} />
    </div>
  );
}
