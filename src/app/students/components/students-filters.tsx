"use client";

import { Filter, Search, X } from "lucide-react";
import { CourseOption, StudentFilters } from "../types";

type StudentsFiltersProps = {
  filters: StudentFilters;
  courses: CourseOption[];
  onFilterChange: <K extends keyof StudentFilters>(
    key: K,
    value: StudentFilters[K],
  ) => void;
  onClearFilters: () => void;
};

export function StudentsFilters({
  filters,
  courses,
  onFilterChange,
  onClearFilters,
}: StudentsFiltersProps) {
  const hasFilters =
    filters.search || filters.role || filters.course || filters.cohortSearch;

  return (
    <div className="bg-white p-3 md:p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
      <div className="flex flex-col xl:flex-row items-center gap-3 md:gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />

          <input
            value={filters.search}
            onChange={(event) => onFilterChange("search", event.target.value)}
            placeholder="Search name, email or phone..."
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full xl:w-auto">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />

            <select
              value={filters.role || "all"}
              onChange={(event) =>
                onFilterChange(
                  "role",
                  event.target.value === "all" ? "" : event.target.value,
                )
              }
              className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-10 text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              <option value="all">All roles</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
              <option value="COURSE_ADMIN">Course Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>

          <select
            value={filters.course || "all"}
            onChange={(event) =>
              onFilterChange(
                "course",
                event.target.value === "all" ? "" : event.target.value,
              )
            }
            className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          >
            <option value="all">All courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>

          <input
            value={filters.cohortSearch}
            onChange={(event) =>
              onFilterChange("cohortSearch", event.target.value)
            }
            placeholder="Search active cohort..."
            className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-black text-slate-500 hover:bg-slate-50 transition"
        >
          <X className="w-4 h-4" />
          Clear filters
        </button>
      )}
    </div>
  );
}
