import { Hash } from "lucide-react";

import { cn, formatDate, formatPrice } from "@/lib/utils";
import { Transaction } from "@/types";
import { PaymentGatewayBadge } from "./payment-gateway-badge";
import { PaymentTransactionStatusBadge } from "./payment-transaction-status-badge";

const BASE_CURRENCY = "NGN";

const currencySymbols: Record<string, string> = {
  NGN: "₦",
  GHS: "₵",
  ZAR: "R",
  KES: "KSh",
  UGX: "USh",
  RWF: "FRw",
};

function displayAmount(amount: any, currency = BASE_CURRENCY) {
  if (currency === BASE_CURRENCY) return formatPrice(amount);

  const num = typeof amount === "string" ? parseFloat(amount) : Number(amount);
  if (Number.isNaN(num)) return `${currencySymbols[currency] || ""}—`;

  const symbol = currencySymbols[currency] || `${currency} `;

  return `${symbol}${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

type PaymentDetailHeroProps = {
  payment: Transaction;
  metadata: Record<string, any>;
};

function getManualPaymentInfo(metadata: Record<string, any>) {
  const isManual =
    metadata?.manualEntry === true || metadata?.manuallyMarkedPaid === true;

  return {
    isManual,
    manualEntry: metadata?.manualEntry === true,
    manuallyMarkedPaid: metadata?.manuallyMarkedPaid === true,
    createdBy: metadata?.createdBy,
    markedPaidBy: metadata?.markedPaidBy,
    manualReason: metadata?.manualReason || metadata?.notes,
    markedPaidAt: metadata?.markedPaidAt,
  };
}

export function PaymentDetailHero({
  payment,
  metadata,
}: PaymentDetailHeroProps) {
  const gateway =
    payment.paymentGateway ||
    (payment.source === "paystack" ? "PAYSTACK" : undefined);

  const currency = metadata.selectedCurrency || BASE_CURRENCY;
  const nativeAmount = metadata.currencyAmount || payment.amount;
  const showConversion = currency !== BASE_CURRENCY;

  const manualInfo = getManualPaymentInfo(metadata);

  return (
    <div className="bg-white p-5 md:p-8 rounded-3xl md:rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-indigo-50/50 rounded-full translate-x-16 md:translate-x-32 -translate-y-16 md:-translate-y-32 z-0" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <PaymentTransactionStatusBadge status={payment.status} />

              {manualInfo.isManual && (
                <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700">
                  Manual Transaction
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-none">
                {displayAmount(nativeAmount, currency)}
              </h1>

              {currency !== BASE_CURRENCY && (
                <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">
                  {currency}
                </span>
              )}
            </div>

            {showConversion && (
              <div className="inline-flex flex-wrap items-center gap-1.5 md:gap-2 px-2.5 py-1 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-[10px] md:text-xs font-bold text-slate-500">
                <span>≈</span>
                <span className="text-slate-900 font-black">
                  {displayAmount(payment.amount, BASE_CURRENCY)}
                </span>
                <span>{BASE_CURRENCY}</span>
              </div>
            )}

            <div className="flex items-center gap-2 md:gap-3 flex-wrap pt-1">
              <div className="flex items-center gap-1.5 md:gap-2 text-slate-400 font-bold text-[10px] md:text-sm">
                <Hash className="w-3 h-3 md:w-4 md:h-4" />
                REF: {payment.transactionRef || "No reference"}
              </div>

              <PaymentGatewayBadge gateway={gateway} source={payment.source} />
            </div>
          </div>

          <div className="text-left md:text-right pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
            <p className="text-[10px] md:text-sm font-bold text-slate-400 mb-1 leading-none uppercase tracking-tighter mt-2 md:mt-0">
              Payment Date
            </p>

            <p className="text-lg md:text-xl font-black text-slate-900">
              {payment.paymentDate
                ? formatDate(payment.paymentDate)
                : "Not completed"}
            </p>

            <p className="text-[10px] font-bold text-slate-400 mt-1">
              Created {formatDate(payment.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
