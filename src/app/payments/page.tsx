"use client";
import React from "react";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import {
  Search,
  FileText,
  Filter,
  ChevronRight,
  Loader2,
  ExternalLink,
  Clock,
  CreditCard,
} from "lucide-react";
import { Transaction } from "@/types";
import { toast } from "sonner";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PaymentStatus from "@/components/payment/payment-status";

const PLAN_STATUS_VALUES = [
  "paid_in_full",
  "in_progress",
  "overdue",
  "abandoned",
];

function PaymentsPageContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "success";
  const initialDuration = searchParams.get("duration") || "all";
  const initialGateway = searchParams.get("gateway") || "all";

  const [payments, setPayments] = useState<Transaction[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [durationFilter, setDurationFilter] = useState(initialDuration);
  const [gatewayFilter, setGatewayFilter] = useState(initialGateway);
  const [loadingExport, setLoadingExport] = useState(false);

  // Counts returned by the API for the current duration window.
  const [totalCount, setTotalCount] = useState(0);
  const [countBySource, setCountBySource] = useState<{
    paystack: number;
    startButton: number;
  }>({
    paystack: 0,
    startButton: 0,
  });

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ duration: durationFilter });
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (gatewayFilter !== "all") params.set("gateway", gatewayFilter);

        const response = await api.get(
          `/sales-dashboard/transactions?${params.toString()}`,
        );
        const { transactions, count, countBySource: breakdown } = response.data;
        setPayments(transactions);
        setFilteredPayments(transactions);
        setTotalCount(count);
        setCountBySource(breakdown ?? { paystack: 0, startButton: 0 });
      } catch (error) {
        console.error("Failed to fetch payments", error);
        toast.error("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [durationFilter, statusFilter, gatewayFilter]);

  useEffect(() => {
    let result = payments;

    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.paymentStatus?.user?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          p.paymentStatus?.user?.email
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          p.transactionRef?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredPayments(result);
  }, [searchQuery, payments]);

  const handleExport = async () => {
    setLoadingExport(true);
    try {
      const response = await api.post("/sales-dashboard/export-to-sheets");
      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Data successfully exported to Google Sheets",
        );
        if (response.data.sheetUrl) {
          window.open(response.data.sheetUrl, "_blank");
        }
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

  // Are any client-side filters active? (duration is server-side, so it doesn't count.)
  const hasActiveFilters =
    searchQuery !== "" || statusFilter !== "all" || gatewayFilter !== "all";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-none">
              Payment Transactions
            </h1>
            {!loading && (
              <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                {hasActiveFilters ? (
                  <>
                    <span>{filteredPayments.length}</span>
                    <span className="text-indigo-400 font-medium">
                      of {totalCount}
                    </span>
                  </>
                ) : (
                  <>
                    <span>{totalCount}</span>
                    <span className="text-indigo-400 font-medium">total</span>
                  </>
                )}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Tracking all sales and incoming revenue
          </p>
          {!loading &&
            (countBySource.paystack > 0 || countBySource.startButton > 0) && (
              <div className="flex gap-4 mt-2 text-[11px] font-medium text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span className="font-bold text-slate-700">
                    {countBySource.paystack}
                  </span>
                  <span>Paystack</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="font-bold text-slate-700">
                    {countBySource.startButton}
                  </span>
                  <span>Start Button</span>
                </span>
              </div>
            )}
        </div>
        <button
          onClick={handleExport}
          disabled={loadingExport}
          className="w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingExport ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <FileText className="w-5 h-5" />
          )}
          Export to Sheets
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3 md:p-4 rounded-3xl border border-slate-100 flex flex-col xl:flex-row items-center gap-3 md:gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email or reference..."
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-3 gap-2 md:gap-3 w-full xl:w-auto">
          <div className="relative">
            <Filter className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            <select
              className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-8 md:pl-10 pr-8 md:pr-10 text-[11px] md:text-sm font-bold appearance-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Statuses</option>
              <option value="success">Successful</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="in_progress">In Progress</option>
              <option value="overdue">Overdue</option>
              <option value="abandoned">Abandoned</option>
            </select>
          </div>
          <div className="relative">
            <CreditCard className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            <select
              className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-8 md:pl-10 pr-8 md:pr-10 text-[11px] md:text-sm font-bold appearance-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
              value={gatewayFilter}
              onChange={(e) => setGatewayFilter(e.target.value)}
            >
              <option value="all">Gateways</option>
              <option value="PAYSTACK">Paystack</option>
              <option value="START_BUTTON">Start Button</option>
            </select>
          </div>
          <div className="relative">
            <Clock className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            <select
              className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-8 md:pl-10 pr-8 md:pr-10 text-[11px] md:text-sm font-bold appearance-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
            >
              <option value="7d">Last 7D</option>
              <option value="30d">Last 30D</option>
              <option value="90d">Last 90D</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table — unchanged from your original */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[700px] md:min-w-0">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 md:px-6 py-4 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                  User
                </th>
                <th className="px-4 md:px-6 py-4 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">
                  Details
                </th>
                <th className="px-4 md:px-6 py-4 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Amount
                </th>
                <th className="px-4 md:px-6 py-4 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-4 md:px-6 py-4 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest hidden lg:table-cell">
                  Date
                </th>
                <th className="px-4 md:px-6 py-4 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-20 text-center text-slate-400 font-medium"
                  >
                    No transactions found match your criteria.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-indigo-50/30 transition-colors group"
                  >
                    <td className="px-4 md:px-6 py-4 md:py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition">
                          {payment.paymentStatus?.user?.name || "Unknown User"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px] md:max-w-none">
                          {payment.paymentStatus?.user?.email}
                        </span>
                        {payment.paymentStatus?.user?.phone_number && (
                          <span className="text-[10px] text-slate-500 font-medium truncate max-w-[120px] md:max-w-none mt-0.5">
                            {payment.paymentStatus.user.phone_number}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 md:py-5 hidden sm:table-cell">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[150px] lg:max-w-[200px]">
                          {payment.paymentStatus?.course?.title || "N/A"}
                        </span>
                        <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-tighter">
                          {payment.paymentPlan?.replace(/_/g, " ") || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 md:py-5">
                      <span className="text-sm font-black text-slate-900 whitespace-nowrap">
                        {formatPrice(payment.amount)}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 md:py-5">
                      <PaymentStatus payment={payment} />
                    </td>
                    <td className="px-4 md:px-6 py-4 md:py-5 whitespace-nowrap hidden lg:table-cell">
                      <span className="text-[11px] font-bold text-slate-500">
                        {payment.paymentDate
                          ? formatDate(payment.paymentDate)
                          : "Processing..."}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 md:py-5 text-right">
                      <a
                        href={`/payments/${payment.id}`}
                        className="inline-flex items-center justify-end gap-1 text-[10px] md:text-xs font-bold text-indigo-600 hover:text-indigo-800 transition whitespace-nowrap"
                      >
                        <span className="hidden sm:inline">Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      }
    >
      <PaymentsPageContent />
    </Suspense>
  );
}
