"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaginationMeta } from "@/types";

type TablePaginationProps = {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  limitOptions?: number[];
};

export function TablePagination({
  pagination,
  onPageChange,
  onLimitChange,
  limitOptions = [10, 20, 50, 100],
}: TablePaginationProps) {
  const start =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;

  const end = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-100 px-4 md:px-6 py-4 bg-white">
      <p className="text-xs font-bold text-slate-500">
        Showing <span className="text-slate-900">{start}</span>
        {" - "}
        <span className="text-slate-900">{end}</span>
        {" of "}
        <span className="text-slate-900">{pagination.total}</span>
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {onLimitChange && (
          <select
            value={pagination.limit}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            className="bg-slate-50 border border-slate-100 rounded-2xl px-3 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {limitOptions.map((option) => (
              <option key={option} value={option}>
                {option} / page
              </option>
            ))}
          </select>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={!pagination.hasPrevPage}
            className={cn(
              "inline-flex items-center justify-center w-10 h-10 rounded-2xl border border-slate-100 text-slate-600 transition",
              pagination.hasPrevPage
                ? "hover:bg-indigo-50 hover:text-indigo-600"
                : "opacity-40 cursor-not-allowed",
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-black text-slate-600 px-2">
            Page {pagination.page} of {pagination.totalPages || 1}
          </span>

          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={!pagination.hasNextPage}
            className={cn(
              "inline-flex items-center justify-center w-10 h-10 rounded-2xl border border-slate-100 text-slate-600 transition",
              pagination.hasNextPage
                ? "hover:bg-indigo-50 hover:text-indigo-600"
                : "opacity-40 cursor-not-allowed",
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
