"use client";

import { TablePagination } from "@/components/shared/table-pagination";
import { usePaymentPlans } from "./hooks/use-payment-plans";
import { PaymentPlansPageHeader } from "./components/payment-plans-page-header";
import { PaymentPlansSummaryCards } from "./components/payment-plans-summary-cards";
import { PaymentPlansFilters } from "./components/payment-plans-filters";
import { PaymentPlansTable } from "./components/payment-plans-table";

export default function PaymentPlansPage() {
  const {
    paymentPlans,
    loading,
    filters,
    setFilter,
    summary,
    pagination,
    setPage,
    setLimit,
  } = usePaymentPlans();

  return (
    <div className="space-y-6">
      <PaymentPlansPageHeader total={pagination.total} loading={loading} />

      <PaymentPlansSummaryCards summary={summary} />

      <PaymentPlansFilters filters={filters} onFilterChange={setFilter} />

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <PaymentPlansTable
          paymentPlans={paymentPlans}
          loading={loading}
          wrapper={false}
        />

        <TablePagination
          pagination={pagination}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      </div>
    </div>
  );
}
