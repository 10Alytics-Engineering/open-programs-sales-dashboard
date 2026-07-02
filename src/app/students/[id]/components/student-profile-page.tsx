"use client";
import { useCurrentAdminUser } from "@/lib/use-user";
import { useStudentProfile } from "../hooks/use-student-profile";
import { StudentProfileHeader } from "./student-profile-header";
import { StudentProfileLoading } from "./student-profile-loading";
import { StudentProfileNotFound } from "./student-profile-not-found";
import { StudentProgramsSection } from "./student-programs-section";
import { StudentRevenueCard } from "./student-revenue-card";
import { StudentTransactionHistory } from "./student-transaction-history";

type StudentProfilePageProps = {
  studentId: string;
};

export function StudentProfilePage({ studentId }: StudentProfilePageProps) {
  const {
    student,
    courses,
    cohorts,
    transactions,
    lifetimeValue,
    loading,
    refresh,
  } = useStudentProfile(studentId);
  const { isSuperAdmin } = useCurrentAdminUser();

  if (loading) {
    return <StudentProfileLoading />;
  }

  if (!student) {
    return <StudentProfileNotFound />;
  }

  const purchasedCourses = student.course_purchased || [];
  const paymentStatuses = student.paymentStatus || [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
      <StudentProfileHeader
        student={student}
        purchasedCoursesCount={purchasedCourses.length}
        transactionsCount={transactions.length}
        canChangeRole={isSuperAdmin}
        onRoleChanged={refresh}
        onStatusChanged={refresh}
      />

      <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-[3fr_1fr]">
        <StudentProgramsSection
          student={student}
          courses={courses}
          cohorts={cohorts}
          purchases={purchasedCourses}
          paymentStatuses={paymentStatuses}
          onRefresh={refresh}
        />

        <StudentRevenueCard
          student={student}
          lifetimeValue={lifetimeValue}
          transactions={transactions}
          purchasedCourses={purchasedCourses}
        />
      </div>

      <StudentTransactionHistory transactions={transactions} />
    </div>
  );
}
