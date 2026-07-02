"use client";

import { useStudents } from "../hooks/use-students";
import { StudentsPageHeader } from "./students-page-header";
import { StudentsFilters } from "./students-filters";
import { StudentsList } from "./students-list";

export function StudentsPageContent() {
  const {
    students,
    courses,
    cohorts,
    loading,
    optionsLoading,
    filters,
    pagination,
    setFilter,
    clearFilters,
    setPage,
    setLimit,
    refreshData,
  } = useStudents();

  return (
    <div className="space-y-6">
      <StudentsPageHeader
        total={pagination.totalUsers}
        loading={loading}
        courses={courses}
        cohorts={cohorts}
        onSuccess={refreshData}
      />

      <StudentsFilters
        filters={filters}
        courses={courses}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
      />

      <StudentsList
        students={students}
        loading={loading}
        optionsLoading={optionsLoading}
        pagination={pagination}
        courses={courses}
        cohorts={cohorts}
        onPageChange={setPage}
        onLimitChange={setLimit}
        refreshData={refreshData}
      />
    </div>
  );
}
