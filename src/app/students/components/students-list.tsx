"use client";

import { Loader2 } from "lucide-react";
import { StudentCard } from "./student-card";
import {
  CohortOption,
  CourseOption,
  StudentPagination,
  StudentUser,
} from "../types";

type StudentsListProps = {
  students: StudentUser[];
  loading: boolean;
  optionsLoading?: boolean;
  pagination: StudentPagination;
  courses: CourseOption[];
  cohorts: CohortOption[];
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  refreshData: () => void;
};

export function StudentsList({
  students,
  loading,
  pagination,
  optionsLoading,
  courses,
  cohorts,
  onPageChange,
  onLimitChange,
  refreshData,
}: StudentsListProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 md:px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-900">
            {pagination.totalUsers} students found
          </p>
          <p className="text-xs font-bold text-slate-400 mt-1">
            Page {pagination.currentPage} of {pagination.totalPages || 1}
          </p>
        </div>

        {loading && (
          <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading students...
          </div>
        )}
      </div>

      {loading && students.length === 0 ? (
        <div className="flex min-h-80 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : students.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-sm font-black text-slate-900">No students found</p>
          <p className="mt-1 text-sm font-medium text-slate-400">
            Try changing your filters or search query.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-50">
          {students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              refreshData={refreshData}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <select
          value={String(pagination.limit)}
          onChange={(event) => onLimitChange(Number(event.target.value))}
          className="w-full sm:w-36 bg-slate-50 border border-slate-100 rounded-2xl px-3 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="10">10 / page</option>
          <option value="20">20 / page</option>
          <option value="50">50 / page</option>
          <option value="100">100 / page</option>
        </select>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          <button
            disabled={!pagination.hasPreviousPage || loading}
            onClick={() => onPageChange(pagination.currentPage - 1)}
            className="rounded-2xl border border-slate-100 px-4 py-2 text-xs font-black text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-xs font-black text-slate-500 px-2">
            {pagination.currentPage} / {pagination.totalPages || 1}
          </span>

          <button
            disabled={!pagination.hasNextPage || loading}
            onClick={() => onPageChange(pagination.currentPage + 1)}
            className="rounded-2xl border border-slate-100 px-4 py-2 text-xs font-black text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
