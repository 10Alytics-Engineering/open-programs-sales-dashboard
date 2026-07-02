"use client";

import { Loader2, Link2, Upload, UserPlus } from "lucide-react";
import { AddStudentModal } from "./add-student-modal";
import { BulkImportStudentsModal } from "./bulk-import-students-modal";
import { UpdateCommunityLinkModal } from "./update-community-link-modal";
import { CohortOption, CourseOption } from "../types";

type StudentsPageHeaderProps = {
  total: number;
  loading: boolean;
  courses: CourseOption[];
  cohorts: CohortOption[];
  onSuccess: () => void;
};

export function StudentsPageHeader({
  total,
  loading,
  courses,
  cohorts,
  onSuccess,
}: StudentsPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-none">
            Students
          </h1>

          {!loading && (
            <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
              {total} total
            </span>
          )}

          {loading && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Refreshing
            </span>
          )}
        </div>

        <p className="text-sm text-slate-500 font-medium mt-1">
          Manage students, roles, courses, cohorts and payment access.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2">
        <AddStudentModal
          courses={courses}
          cohorts={cohorts}
          onSuccess={onSuccess}
          trigger={
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition">
              <UserPlus className="w-4 h-4" />
              Add Student
            </button>
          }
        />

        <BulkImportStudentsModal
          courses={courses}
          cohorts={cohorts}
          onSuccess={onSuccess}
          trigger={
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-100 px-5 py-3 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50 transition">
              <Upload className="w-4 h-4" />
              Bulk Import
            </button>
          }
        />

        <UpdateCommunityLinkModal
          trigger={
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-100 px-5 py-3 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50 transition">
              <Link2 className="w-4 h-4" />
              Community Link
            </button>
          }
        />
      </div>
    </div>
  );
}
