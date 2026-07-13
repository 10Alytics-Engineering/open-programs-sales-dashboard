"use client";
import React from "react";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { formatPrice, formatDate, cn } from "@/lib/utils";

import {
  Users,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Activity,
  ChevronRight,
  Calendar,
  CalendarClock,
  Wallet,
  Receipt,
  Banknote,
  ListChecks,
  FileText,
  XCircle,
} from "lucide-react";
import { DashboardData } from "@/types";
import Link from "next/link";
import { toast } from "sonner";
import { TablePagination } from "@/components/shared/table-pagination";
import { usePayments } from "./transactions/hooks/use-payments";
import { PaymentsTableLoader } from "./transactions/components/payments-table-loader";
import { PaymentsEmptyState } from "./transactions/components/payments-empty-state";

// ---------------------------------------------------------------------------
// Currency catalogue (provided). NGN is the reporting/base currency.
// ---------------------------------------------------------------------------
const CURRENCY_SYMBOLS: Record<
  string,
  { name: string; symbol: string; channels: string[] }
> = {
  NGN: {
    name: "NGN",
    symbol: "₦",
    channels: ["bank", "card", "bank_transfer", "ussd"],
  },
  GHS: { name: "GHS", symbol: "₵", channels: ["card", "mobile_money"] },
  ZAR: { name: "ZAR", symbol: "R", channels: ["eft", "qr", "card"] },
  KES: { name: "KES", symbol: "KSh", channels: ["card", "mobile_money"] },
  UGX: { name: "UGX", symbol: "USh", channels: ["mobile_money"] },
  RWF: { name: "RWF", symbol: "FRw", channels: ["mobile_money"] },
};

const BASE_CURRENCY = "NGN";

const formatCurrency = (amount: number, currency: string = BASE_CURRENCY) => {
  if (currency === BASE_CURRENCY) return formatPrice(amount);
  const symbol = CURRENCY_SYMBOLS[currency]?.symbol ?? `${currency} `;
  return `${symbol}${Number(amount).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
};

// Brand palette used for charts & breakdown bars (indigo-led, with accents).
const COLORS = [
  "#6366f1",
  "#a855f7",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#10b981",
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState("7d");
  const [loadingExport, setLoadingExport] = useState(false);

  const {
    payments,
    loading: loadingTransactions,
    pagination,
    setPage,
    setLimit,
  } = usePayments();

  const handleExport = async () => {
    setLoadingExport(true);
    try {
      const response = await api.post("/sales-dashboard/export-to-sheets");
      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Data successfully exported to Google Sheets",
        );
        if (response.data.sheetUrl)
          window.open(response.data.sheetUrl, "_blank");
      } else {
        toast.error(response.data.error || "Failed to export data");
      }
    } catch (error: any) {
      console.error("Export error", error);
      toast.error(
        error?.response?.data?.error ||
          "Failed to export data to Google Sheets",
      );
    } finally {
      setLoadingExport(false);
    }
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [dashboardResponse] = await Promise.all([
          api.get(`/sales-dashboard/dashboard-all?duration=${duration}`),
        ]);

        setData(dashboardResponse.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [duration]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!data)
    return <div>Failed to load dashboard. Please check your connection.</div>;

  // -------------------------------------------------------------------------
  // Pull new fields with safe fallbacks. Backend may not have shipped these
  // yet — render gracefully where missing instead of crashing.
  // -------------------------------------------------------------------------
  const d = data as any;

  const planStatus = d.planStatus ?? {
    totalPlans: data.summary.activityStats.total,
    paidInFull: data.summary.activityStats.success,
    inProgress: 0,
    overdue: 0,
  };

  const financials = d.financials ?? {
    collected: data.summary.currentRevenue,
    scheduled: 0,
    contractValue: data.summary.currentRevenue,
    atRisk: 0,
  };

  const planMix = d.planMix ?? {
    oneTime: { count: 0, percent: 0 },
    installment: { count: 0, percent: 0 },
    avgPlanLength: null,
    avgTimeToFullMonths: null,
  };

  const currencyBreakdown: Array<{
    currency: string;
    amountInBase: number;
    nativeAmount?: number;
    percent: number;
  }> = d.currencyBreakdown ?? [];

  const topCourses: Array<any> = data.topCourses ?? [];

  // -------------------------------------------------------------------------
  // Header copy helpers (preserved from original).
  // -------------------------------------------------------------------------
  const getTimelineDateRange = () => {
    if (duration === "all") return "Lifetime Accumulation";
    const pastDate = new Date();
    const days = duration === "30d" ? 30 : duration === "90d" ? 90 : 7;
    pastDate.setDate(pastDate.getDate() - days);
    return `${formatDate(pastDate.toISOString())} - Today`;
  };

  function formatTransactionCurrency(transaction: any) {
    const currency =
      transaction.displayCurrency ||
      transaction.providerCurrency ||
      transaction.currency ||
      "NGN";

    const amount =
      transaction.displayAmount ??
      transaction.providerAmount ??
      transaction.amount ??
      0;

    return formatCurrency(Number(amount || 0), currency);
  }

  const getTimelineTitle = () => {
    switch (duration) {
      case "30d":
        return "Monthly Financial Activity";
      case "90d":
        return "Quarterly Financial Activity";
      case "all":
        return "Lifetime Financial Activity";
      default:
        return "Weekly Financial Activity";
    }
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500">
      {/* ============================================================== */}
      {/* HEADER */}
      {/* ============================================================== */}
      <section className="space-y-4 md:space-y-6 relative">
        <div className="absolute -inset-4 bg-indigo-50/30 rounded-[40px] -z-10 blur-2xl hidden md:block" />

        <div className="flex flex-col xl:flex-row xl:items-end justify-between px-1 md:px-2 gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-2 md:w-3 h-10 md:h-12 bg-indigo-600 rounded-full shadow-lg shadow-indigo-200" />
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-1 md:mb-2">
                {getTimelineTitle()}
              </h2>
              <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <Calendar className="w-3 h-3 text-indigo-500" />
                {getTimelineDateRange()}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
              {[
                { val: "7d", label: "7D" },
                { val: "30d", label: "30D" },
                { val: "90d", label: "90D" },
                { val: "all", label: "ALL" },
              ].map((p) => (
                <button
                  key={p.val}
                  onClick={() => setDuration(p.val)}
                  className={cn(
                    "flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-black transition-all",
                    duration === p.val
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                      : "text-slate-400 hover:text-slate-600",
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleExport}
              disabled={loadingExport}
              className="group flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 border border-indigo-500 rounded-2xl text-[10px] font-black text-white hover:bg-indigo-700 transition-all uppercase tracking-widest shadow-lg shadow-indigo-100 disabled:opacity-50"
            >
              {loadingExport ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5" />
              )}
              Export Sheet
            </button>
            <Link
              href="/payments"
              className="group flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all uppercase tracking-widest shadow-sm"
            >
              Full Report
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ============================================================== */}
        {/* PLAN STATUS — replaces the original "Quick Action" cards */}
        {/* ============================================================== */}
        <SectionLabel>Plan Status</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <QuickActionCard
            label="Total Plans"
            value={planStatus.totalPlans}
            icon={Activity}
            color="bg-slate-900"
            href={`/payments?duration=${duration}`}
          />
          <QuickActionCard
            label="Paid in Full"
            value={planStatus.paidInFull}
            icon={CheckCircle2}
            color="bg-emerald-500"
            href={`/payments?status=success&duration=${duration}`}
            activeColor="text-emerald-500"
          />
          <QuickActionCard
            label="In Progress"
            value={planStatus.inProgress}
            icon={Clock}
            color="bg-indigo-500"
            href={`/payments?status=in_progress&duration=${duration}`}
            activeColor="text-indigo-500"
          />
          <QuickActionCard
            label="Abandoned"
            value={planStatus.abandoned}
            icon={XCircle}
            color="bg-slate-400"
            href={`/payments?status=abandoned&duration=${duration}`}
            activeColor="text-slate-500"
          />
          <QuickActionCard
            label="Overdue"
            value={planStatus.overdue}
            icon={AlertCircle}
            color="bg-rose-500"
            href={`/payments?status=overdue&duration=${duration}`}
            activeColor="text-rose-500"
          />
        </div>
      </section>

      {/* ============================================================== */}
      {/* FINANCIALS — replaces the original 4 StatCards */}
      {/* ============================================================== */}
      <section className="space-y-3">
        <SectionLabel>Financials · {BASE_CURRENCY} equivalent</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title="Total Revenue"
            value={formatPrice(financials.collected)}
            change={data.summary.growthPercentage}
            icon={Wallet}
            subtitle="Cash actually received"
            tone="default"
          />
          <StatCard
            title="Outstanding Payments"
            value={formatPrice(financials.scheduled)}
            change={0}
            icon={CalendarClock}
            subtitle="Due on installments"
            tone="default"
          />
          <StatCard
            title="Overdue Payments"
            value={formatPrice(financials.atRisk)}
            change={0}
            icon={CreditCard}
            subtitle="Average spend per user"
            tone="default"
          />

          <StatCard
            title="Active Students"
            value={topCourses
              .reduce(
                (sum: number, c: any) => sum + Number(c.enrollments || 0),
                0,
              )
              .toLocaleString()}
            change={0}
            icon={Users}
            subtitle="Enrolled this period"
            tone="default"
          />
        </div>
      </section>

      {/* ============================================================== */}
      {/* ROW: One-time vs Installment | Currency Breakdown */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* One-time vs Installment */}
        <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-black text-slate-900 flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-indigo-500" />
              One-time vs Installment
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Plan choice
            </span>
          </div>

          {/* Stacked bar */}
          <div className="flex h-2.5 rounded-full overflow-hidden mb-5 bg-slate-100">
            <div
              className="bg-indigo-500"
              style={{ width: `${planMix.oneTime.percent || 0}%` }}
            />
            <div
              className="bg-pink-400"
              style={{ width: `${planMix.installment.percent || 0}%` }}
            />
          </div>

          <div className="space-y-3 mb-5">
            <LegendRow
              label="One-time payment"
              countLabel={`${planMix.oneTime.count ?? 0} plans`}
              percent={planMix.oneTime.percent}
              color="bg-indigo-500"
            />
            <LegendRow
              label="Installments"
              countLabel={`${planMix.installment.count ?? 0} plans`}
              percent={planMix.installment.percent}
              color="bg-pink-400"
            />
          </div>
        </div>

        {/* Currency Breakdown */}
        <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-black text-slate-900 flex items-center gap-2">
              <Banknote className="w-4 h-4 text-indigo-500" />
              Currency Breakdown
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              FX locked at payment
            </span>
          </div>

          {currencyBreakdown.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              <Banknote className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-[10px] md:text-xs font-bold italic uppercase tracking-tighter">
                No currency data yet
              </p>
            </div>
          ) : (
            <>
              <div className="flex h-2.5 rounded-full overflow-hidden mb-5 bg-slate-100">
                {currencyBreakdown.map((c, i) => (
                  <div
                    key={c.currency}
                    style={{
                      width: `${c.percent}%`,
                      backgroundColor: COLORS[i % COLORS.length],
                    }}
                  />
                ))}
              </div>
              <div className="space-y-2.5">
                {currencyBreakdown.map((c, i) => (
                  <div
                    key={c.currency}
                    className="flex items-center justify-between text-xs md:text-sm"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="font-bold text-slate-700">
                        {CURRENCY_SYMBOLS[c.currency]?.name ?? c.currency}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4 text-slate-500">
                      <span className="font-medium tabular-nums">
                        {c.nativeAmount != null
                          ? formatCurrency(c.nativeAmount, c.currency)
                          : formatCurrency(c.amountInBase, BASE_CURRENCY)}
                      </span>
                      <span className="font-black text-slate-900 w-10 text-right tabular-nums">
                        {Math.round(c.percent)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {/* ============================================================== */}
      {/* Recent Transactions */}
      {/* ============================================================== */}
      <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-black text-slate-900">
            Recent Transactions
          </h3>
        </div>

        {payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400">
            <Receipt className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-[10px] md:text-xs font-bold italic uppercase tracking-tighter">
              No transactions yet
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-180">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Payer
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Course
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Gateway
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {loadingTransactions ? (
                  <PaymentsTableLoader />
                ) : payments.length === 0 ? (
                  <PaymentsEmptyState />
                ) : (
                  payments.map((transaction) => {
                    const user = transaction.paymentStatus?.user;
                    const course = transaction.paymentStatus?.course;
                    const gateway =
                      transaction.paymentGateway ||
                      (transaction.source === "paystack" ? "PAYSTACK" : "—");

                    return (
                      <tr
                        key={`${transaction.source}-${transaction.id}`}
                        className="hover:bg-indigo-50/30"
                      >
                        <td className="px-4 py-4">
                          <p className="text-sm font-black text-slate-900">
                            {user?.name || "Unknown User"}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400">
                            {user?.email || "No email"}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <p className="text-xs font-bold text-slate-700 truncate max-w-56">
                            {course?.title || "No course attached"}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400">
                            {transaction.transactionRef || "No reference"}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-[10px] font-black uppercase text-slate-500">
                            {gateway}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm font-black text-slate-900 whitespace-nowrap">
                            {transaction.displayAmountFormatted ||
                              formatTransactionCurrency(transaction)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-[10px] font-black uppercase text-slate-500">
                            {transaction.status}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-right">
                          <Link
                            href={`/payments/${transaction.id}?source=${transaction.source || "unified"}`}
                            className="inline-flex items-center gap-1 text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase"
                          >
                            Details
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        <TablePagination
          pagination={pagination}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      </div>
    </div>
  );
}

// ===========================================================================
// Helper components
// ===========================================================================

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.18em] px-1">
      {children}
    </p>
  );
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  subtitle,
  tone = "default",
}: any) {
  const isPositive = change >= 0;
  const isRisk = tone === "risk";

  return (
    <div
      className={cn(
        "bg-white p-4 md:p-6 rounded-3xl border shadow-sm transition-all hover:shadow-md hover:-translate-y-1",
        isRisk ? "border-rose-100" : "border-slate-100",
      )}
    >
      <div className="flex justify-between items-start mb-3 md:mb-4">
        <div
          className={cn(
            "p-2 md:p-3 rounded-xl md:rounded-2xl",
            isRisk
              ? "bg-rose-50 text-rose-600"
              : "bg-indigo-50 text-indigo-600",
          )}
        >
          <Icon className="w-4 h-4 md:w-5 md:h-5" />
        </div>
        {change !== 0 && (
          <div
            className={cn(
              "flex items-center gap-0.5 md:gap-1 text-[10px] md:text-sm font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg",
              isPositive
                ? "text-emerald-600 bg-emerald-50"
                : "text-rose-600 bg-rose-50",
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
            ) : (
              <ArrowDownRight className="w-3 h-3 md:w-4 md:h-4" />
            )}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] md:text-sm font-bold text-slate-400 mb-0.5 md:mb-1 uppercase tracking-tight">
          {title}
        </p>
        <h4
          className={cn(
            "text-xl md:text-3xl font-black mb-0.5 md:mb-1 leading-none",
            isRisk ? "text-rose-600" : "text-slate-900",
          )}
        >
          {value}
        </h4>
        <p className="text-[9px] md:text-xs font-bold text-slate-400 italic">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function QuickActionCard({
  label,
  value,
  icon: Icon,
  color,
  href,
  activeColor,
}: any) {
  return (
    <Link
      href={href}
      className="bg-white p-3 md:p-5 rounded-2xl md:rounded-4xl border border-slate-100 shadow-sm flex items-center gap-2 md:gap-4 transition-all hover:border-indigo-200 hover:shadow-md active:scale-95 group min-w-0"
    >
      <div
        className={cn(
          "w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg transition-transform group-hover:scale-110 duration-300",
          color,
        )}
      >
        <Icon className="w-4 h-4 md:w-6 md:h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5 md:mb-1">
          {label}
        </p>
        <p
          className={cn(
            "text-sm md:text-2xl font-black leading-none truncate",
            activeColor || "text-slate-900",
          )}
        >
          {value}
        </p>
      </div>
      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors shrink-0">
        <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
      </div>
    </Link>
  );
}

function LegendRow({
  label,
  countLabel,
  percent,
  color,
}: {
  label: string;
  countLabel: string;
  percent: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between text-xs md:text-sm">
      <div className="flex items-center gap-2">
        <span className={cn("w-2 h-2 rounded-full", color)} />
        <span className="font-bold text-slate-700">{label}</span>
      </div>
      <div className="flex items-center gap-4 text-slate-500">
        <span className="font-medium">{countLabel}</span>
        <span className="font-black text-slate-900 w-10 text-right tabular-nums">
          {Math.round(percent || 0)}%
        </span>
      </div>
    </div>
  );
}

function AgingCard({
  label,
  bucket,
  tone,
}: {
  label: string;
  bucket: { amount: number; count: number };
  tone: "amber" | "rose";
}) {
  const styles =
    tone === "amber"
      ? {
          bg: "bg-amber-50",
          border: "border-amber-100",
          text: "text-amber-700",
          subtext: "text-amber-600",
        }
      : {
          bg: "bg-rose-50",
          border: "border-rose-100",
          text: "text-rose-700",
          subtext: "text-rose-600",
        };

  return (
    <div className={cn("p-4 rounded-2xl border", styles.bg, styles.border)}>
      <p
        className={cn(
          "text-[10px] font-black uppercase tracking-widest mb-2",
          styles.subtext,
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "text-lg md:text-xl font-black tracking-tight",
          styles.text,
        )}
      >
        {formatPrice(bucket?.amount || 0)}
      </p>
      <p
        className={cn(
          "text-[10px] md:text-xs font-bold mt-0.5",
          styles.subtext,
        )}
      >
        {bucket?.count || 0} plans
      </p>
    </div>
  );
}
