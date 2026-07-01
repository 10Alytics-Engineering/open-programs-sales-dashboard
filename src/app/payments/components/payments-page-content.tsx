"use client";

import { TablePagination } from "@/components/shared/table-pagination";
import { usePayments } from "../hooks/use-payments";
import { PaymentsPageHeader } from "./payments-page-header";
import { PaymentsFilters } from "./payments-filters";
import { PaymentsTable } from "./payments-table";

export function PaymentsPageContent() {
  const {
    payments,
    loading,
    loadingExport,
    filters,
    setFilter,
    countBySource,
    pagination,
    setPage,
    setLimit,
    handleExport,
  } = usePayments();

  return (
    <div className="space-y-6">
      <PaymentsPageHeader
        total={pagination.total}
        loading={loading}
        loadingExport={loadingExport}
        countBySource={countBySource}
        onExport={handleExport}
      />

      <PaymentsFilters filters={filters} onFilterChange={setFilter} />

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <PaymentsTable payments={payments} loading={loading} />

        <TablePagination
          pagination={pagination}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      </div>
    </div>
  );
}
