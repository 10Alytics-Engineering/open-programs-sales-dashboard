"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import {
  ArrowLeft,
  User,
  BookOpen,
  Hash,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  CreditCard,
} from "lucide-react";
import { Transaction } from "@/types";
import { toast } from "sonner";

// Reporting currency for the dashboard. All non-matching currencies show a converted equivalent.
const BASE_CURRENCY = "NGN";

// Currency formatting — falls through to formatPrice for NGN to preserve existing display.
const CURRENCY_SYMBOLS: Record<
  string,
  { name: string; symbol: string; channels: string[] }
> = {
  NGN: {
    name: "NGN",
    symbol: "₦",
    channels: ["bank", "card", "bank_transfer", "ussd"],
  },
  GHS: {
    name: "GHS",
    symbol: "₵",
    channels: ["card", "mobile_money"],
  },
  ZAR: {
    name: "ZAR",
    symbol: "R",
    channels: ["eft", "qr", "card"],
  },
  KES: {
    name: "KES",
    symbol: "KSh",
    channels: ["card", "mobile_money"],
  },
  UGX: {
    name: "UGX",
    symbol: "USh",
    channels: ["mobile_money"],
  },
  RWF: {
    name: "RWF",
    symbol: "FRw",
    channels: ["mobile_money"],
  },
};
const displayAmount = (amount: any, currency: string = BASE_CURRENCY) => {
  if (currency === BASE_CURRENCY) return formatPrice(amount);
  const num = typeof amount === "string" ? parseFloat(amount) : Number(amount);
  if (isNaN(num)) return `${CURRENCY_SYMBOLS[currency]?.symbol || ""}—`;
  const symbol = CURRENCY_SYMBOLS[currency]?.symbol || `${currency} `;
  return `${symbol}${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Per-gateway pill styling. Add new gateways here as you support them.
const GATEWAY_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  PAYSTACK: {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },
  STRIPE: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },
  STARTBUTTON: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
};

const getGatewayStyle = (gateway: string) =>
  GATEWAY_STYLES[gateway.toUpperCase()] || {
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
  };

export default function PaymentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [payment, setPayment] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/sales-dashboard/transactions/${id}`);
        setPayment(response.data);
      } catch (error) {
        console.error("Failed to fetch payment details", error);
        toast.error("Failed to load details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!payment) return <div>Payment record not found.</div>;

  const status = payment.status;
  const user = payment.paymentStatus?.user;
  const course = payment.paymentStatus?.course;
  const cohort = payment.paymentStatus?.cohort;
  const installments = payment.paymentStatus?.paymentInstallments || [];

  const metaData = payment.metadata ? JSON.parse(payment.metadata) : null;

  // Gateway: prefer the explicit field; for legacy rows from the paystackTransaction table,
  // infer "PAYSTACK" from the source tag returned by the merged endpoint.
  const gateway =
    (payment as any).paymentGateway ||
    ((payment as any).source === "paystack" ? "PAYSTACK" : null);
  const gatewayStyle = gateway ? getGatewayStyle(gateway) : null;

  // Currency: defaults to NGN if the row predates the multicurrency schema change.
  const currency = (metaData as any).selectedCurrency || BASE_CURRENCY;
  const amountInBase = (payment as any).amount;
  const showConversion = currency !== BASE_CURRENCY && amountInBase;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Transactions
      </button>

      {/* Header Info */}
      <div className="bg-white p-5 md:p-8 rounded-3xl md:rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-indigo-50/50 rounded-full translate-x-16 md:translate-x-32 -translate-y-16 md:-translate-y-32 -z-0" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="space-y-1.5 md:space-y-2">
              <span
                className={cn(
                  "px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest inline-block",
                  status === "success"
                    ? "bg-emerald-100 text-emerald-700"
                    : status === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-rose-100 text-rose-700",
                )}
              >
                Transaction {status}
              </span>

              {/* Amount + currency */}
              <div className="flex items-baseline gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-none">
                  {displayAmount(
                    metaData.currencyAmount || amountInBase,
                    currency,
                  )}
                </h1>
                {currency !== BASE_CURRENCY && (
                  <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">
                    {currency}
                  </span>
                )}
              </div>

              {/* Conversion pill — only renders for non-base-currency payments */}
              {showConversion && (
                <div className="inline-flex flex-wrap items-center gap-1.5 md:gap-2 mt-1 px-2.5 py-1 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-[10px] md:text-xs font-bold text-slate-500">
                  <span>≈</span>
                  <span className="text-slate-900 font-black">
                    {displayAmount(amountInBase, BASE_CURRENCY)}
                  </span>
                  <span>{BASE_CURRENCY}</span>
                </div>
              )}

              {/* REF + gateway chip */}
              <div className="flex items-center gap-2 md:gap-3 flex-wrap pt-1">
                <div className="flex items-center gap-1.5 md:gap-2 text-slate-400 font-bold text-[10px] md:text-sm">
                  <Hash className="w-3 h-3 md:w-4 md:h-4" />
                  REF: {payment.transactionRef}
                </div>

                {gateway && gatewayStyle && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border",
                      gatewayStyle.bg,
                      gatewayStyle.text,
                      gatewayStyle.border,
                    )}
                  >
                    <CreditCard className="w-2.5 h-2.5 md:w-3 md:h-3" />
                    {gateway === "START_BUTTON" ? "Start Button" : gateway}
                  </span>
                )}
              </div>
            </div>

            <div className="text-left md:text-right pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
              <p className="text-[10px] md:text-sm font-bold text-slate-400 mb-0.5 md:mb-1 leading-none uppercase tracking-tighter mt-2 md:mt-0">
                Payment Date
              </p>
              <p className="text-lg md:text-xl font-black text-slate-900">
                {payment.paymentDate ? formatDate(payment.paymentDate) : "---"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 border-t border-slate-100 pt-5 md:pt-8">
            {/* User Info */}
            <div className="flex gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-600 flex-shrink-0">
                <User className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="space-y-0.5 md:space-y-1">
                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                  Payer Details
                </p>
                <p className="text-base md:text-lg font-black text-slate-900 leading-tight">
                  {user?.name}
                </p>
                <p className="text-[10px] md:text-sm font-bold text-slate-500">
                  {user?.email}
                </p>
                {user?.phone_number && (
                  <p className="text-[10px] md:text-sm font-bold text-slate-500">
                    {user.phone_number}
                  </p>
                )}
              </div>
            </div>

            {/* Course Info */}
            <div className="flex gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-violet-100 rounded-xl md:rounded-2xl flex items-center justify-center text-violet-600 flex-shrink-0">
                <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="space-y-0.5 md:space-y-1">
                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                  Course & Program
                </p>
                <p className="text-base md:text-lg font-black text-slate-900 leading-tight uppercase">
                  {course?.title}
                </p>
                <p className="text-[10px] md:text-sm font-bold text-slate-500 italic">
                  Cohort: {cohort?.name || "Not assigned"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Details & Installments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 pb-10 md:pb-0">
        <div className="lg:col-span-1 bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 md:p-8 rounded-3xl md:rounded-[40px] text-white shadow-xl shadow-indigo-100 h-fit">
          <div className="space-y-6 md:space-y-8">
            <div>
              <p className="text-indigo-100/60 text-[10px] md:text-xs font-black uppercase tracking-widest mb-1 md:mb-2">
                Payment Plan
              </p>
              <p className="text-xl font-black tracking-tight leading-none uppercase">
                {payment.paymentPlan?.replace(/_/g, " ") || "N/A"}
              </p>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between text-[11px] md:text-sm py-2.5 md:py-3 border-b border-indigo-500/30">
                <span className="text-indigo-100/60 font-bold uppercase tracking-tighter">
                  Plan Status
                </span>
                <span className="font-black italic uppercase italic tracking-tighter text-indigo-100">
                  {payment.paymentStatus?.status.replace(/_/g, " ")}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] md:text-sm py-2.5 md:py-3 border-b border-indigo-500/30">
                <span className="text-indigo-100/60 font-bold uppercase tracking-tighter">
                  Base Price
                </span>
                <span className="font-black tracking-tighter text-indigo-100">
                  {course?.price
                    ? displayAmount(course.price, currency)
                    : "---"}
                </span>
              </div>
              {payment?.paymentPlan?.includes("INSTALLMENT") && (
                <div className="flex items-center justify-between text-[11px] md:text-sm py-2.5 md:py-3 border-b border-indigo-500/30">
                  <span className="text-indigo-100/60 font-bold uppercase tracking-tighter">
                    Installment Number
                  </span>
                  <span className="font-black tracking-tighter text-indigo-100">
                    {metaData?.installmentNumber
                      ? `#${metaData.installmentNumber}`
                      : installments.length > 0
                        ? `${installments.filter((i) => i.paid).length} of ${installments.length}`
                        : "N/A"}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-[11px] md:text-sm pt-3 md:pt-4">
                <span className="text-indigo-100/60 font-bold uppercase tracking-tighter">
                  Total Collected
                </span>
                <span className="text-lg md:text-2xl font-black tracking-tighter text-white">
                  {displayAmount(
                    installments
                      .filter((i) => i.paid)
                      .reduce((sum, i) => sum + Number(i.amount), 0) ||
                      payment.amount,
                    BASE_CURRENCY,
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Installment Tracker */}
        <div className="lg:col-span-2 bg-white p-5 md:p-8 rounded-3xl md:rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 md:mb-8">
            <h3 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-2 leading-none uppercase tracking-tighter">
              Installment Schedule
            </h3>
            <span className="text-[10px] md:text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full w-fit">
              {installments.length} Installments Defined
            </span>
          </div>

          <div className="space-y-3 md:space-y-4">
            {installments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 md:py-12 text-slate-400">
                <AlertCircle className="w-8 h-8 md:w-10 md:h-10 mb-2 opacity-20" />
                <p className="text-[10px] md:text-sm font-bold underline italic tracking-tighter uppercase">
                  No installment plan for this student.
                </p>
              </div>
            ) : (
              installments.map((inst) => (
                <div
                  key={inst.id}
                  className={cn(
                    "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 md:p-5 rounded-2xl md:rounded-3xl border transition-all hover:scale-[1.01]",
                    inst.paid
                      ? "bg-emerald-50/30 border-emerald-100/50"
                      : "bg-slate-50 border-slate-100",
                  )}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div
                      className={cn(
                        "w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-xs md:text-sm shrink-0",
                        inst.paid
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-white text-slate-400 border border-slate-200",
                      )}
                    >
                      {inst.installmentNumber}
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-black text-slate-900 leading-none mb-1">
                        Installment #{inst.installmentNumber}
                      </p>
                      <p className="text-[10px] md:text-xs font-bold text-slate-400 leading-none italic uppercase tracking-tighter">
                        Due on {formatDate(inst.dueDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-6 pt-2 sm:pt-0 border-t sm:border-none border-slate-200/50">
                    <p className="text-base md:text-lg font-black text-slate-900 tracking-tighter italic">
                      {displayAmount(inst.amount, currency)}
                    </p>
                    <div
                      className={cn(
                        "flex items-center gap-1 text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2.5 md:px-3 py-1 rounded-full",
                        inst.paid
                          ? "text-emerald-600 bg-emerald-100/50"
                          : "text-slate-400 bg-white",
                      )}
                    >
                      {inst.paid ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Paid
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" /> Pending
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
