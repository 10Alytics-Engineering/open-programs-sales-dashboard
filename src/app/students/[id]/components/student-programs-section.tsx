"use client";

import { GraduationCap } from "lucide-react";
import { AddStudentCourseModal } from "./add-student-course-modal";
import { StudentProgramPaymentCard } from "./student-program-payment-card";

type StudentProgramsSectionProps = {
  student: any;
  courses: any[];
  cohorts: any[];
  purchases: any[];
  paymentStatuses: any[];
  onRefresh: () => void;
};

export function StudentProgramsSection({
  student,
  courses,
  cohorts,
  purchases,
  paymentStatuses,
  onRefresh,
}: StudentProgramsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-black uppercase tracking-tighter text-slate-900">
            <GraduationCap className="text-indigo-600" />
            Program Enrollments
          </h2>

          <p className="mt-1 text-sm font-bold text-slate-400">
            Courses, cohorts and payment summary for this student.
          </p>
        </div>

        <AddStudentCourseModal
          studentId={student.id}
          courses={courses}
          cohorts={cohorts}
          onSuccess={onRefresh}
        />
      </div>

      <div className="space-y-4">
        {purchases.length > 0 ? (
          purchases.map((purchase: any) => (
            <StudentProgramPaymentCard
              key={purchase.id || purchase.course?.id}
              student={student}
              purchase={purchase}
              paymentStatuses={paymentStatuses}
              cohorts={cohorts}
              onRefresh={onRefresh}
            />
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center md:p-12">
            <GraduationCap className="mx-auto mb-4 h-12 w-12 text-slate-200" />
            <p className="text-sm font-bold text-slate-400">
              No active enrollments found for this student.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
