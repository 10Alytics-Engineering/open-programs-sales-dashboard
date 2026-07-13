"use client";

import { FileText, Loader2 } from "lucide-react";

type PaymentsPageHeaderProps = {
  total: number;
  loading: boolean;
  loadingExport: boolean;
  countBySource: {
    paystack: number;
    stripe?: number;
    startButton: number;
  };
  onExport: () => void;
};

export function PaymentsPageHeader({
  total,
  loading,
  loadingExport,
  countBySource,
  onExport,
}: PaymentsPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-none">
            Payment Transactions
          </h1>

          {!loading && (
            <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
              <span>{total}</span>
              <span className="text-indigo-400 font-medium">total</span>
            </span>
          )}
        </div>

        <p className="text-sm text-slate-500 font-medium mt-1">
          Track actual incoming payments across all gateways.
        </p>

        {!loading &&
          (countBySource.paystack > 0 ||
            countBySource.startButton > 0 ||
            Number(countBySource.stripe || 0) > 0) && (
            <div className="flex flex-wrap gap-4 mt-2 text-[11px] font-medium text-slate-500">
              <SourceCount label="Paystack" count={countBySource.paystack} />
              <SourceCount
                label="Start Button"
                count={countBySource.startButton}
              />
              {Number(countBySource.stripe || 0) > 0 && (
                <SourceCount label="Stripe" count={countBySource.stripe || 0} />
              )}
            </div>
          )}
      </div>

      <button
        onClick={onExport}
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
  );
}

function SourceCount({ label, count }: { label: string; count: number }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
      <span className="font-bold text-slate-700">{count}</span>
      <span>{label}</span>
    </span>
  );
}
