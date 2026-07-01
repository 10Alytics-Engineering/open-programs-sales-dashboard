import Link from "next/link";
import { Plus } from "lucide-react";

type PaymentPlansPageHeaderProps = {
  total: number;
  loading: boolean;
};

export function PaymentPlansPageHeader({
  total,
  loading,
}: PaymentPlansPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-none">
            Payment Plans
          </h1>

          {!loading && (
            <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
              {total} total
            </span>
          )}
        </div>

        <p className="text-sm text-slate-500 font-medium mt-1">
          Track expected revenue, installments, outstanding balances and plan
          status.
        </p>
      </div>

      {/* <Link
        href="/payment-plans/new"
        className="w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 active:scale-95 text-sm"
      >
        <Plus className="w-5 h-5" />
        Add Payment Plan
      </Link> */}
    </div>
  );
}
