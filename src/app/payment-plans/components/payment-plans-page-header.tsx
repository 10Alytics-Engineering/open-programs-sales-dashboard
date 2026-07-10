import Link from "next/link";
import { Download, Loader2, Plus } from "lucide-react";

type PaymentPlansPageHeaderProps = {
  total: number;
  loading: boolean;
  exporting?: boolean;
  onExport: () => void;
};

export function PaymentPlansPageHeader({
  total,
  loading,
  exporting,
  onExport,
}: PaymentPlansPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-black leading-none text-slate-900 md:text-2xl">
            Payment Plans
          </h1>

          {!loading && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
              {total} total
            </span>
          )}
        </div>

        <p className="mt-1 text-sm font-medium text-slate-500">
          Track expected revenue, installments, outstanding balances and
          collection status.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onExport}
          disabled={exporting}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
        >
          {exporting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Download className="h-5 w-5" />
          )}

          {exporting ? "Exporting..." : "Export Excel"}
        </button>

        <Link
          href="/payment-plans/new"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 active:scale-95 md:w-auto"
        >
          <Plus className="h-5 w-5" />
          Add Payment Plan
        </Link>
      </div>
    </div>
  );
}
