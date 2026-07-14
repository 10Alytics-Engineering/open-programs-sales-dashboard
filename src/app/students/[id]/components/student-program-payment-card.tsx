"use client";

import { Banknote, CalendarDays, CreditCard, WalletCards } from "lucide-react";

import { cn, formatDate, formatPrice } from "@/lib/utils";
import { ChangeStudentCourseCohortModal } from "./change-student-course-cohort-modal";
import { RemoveStudentCourseModal } from "./remove-student-course-modal";
import { formatMoneyAmount } from "@/lib/payment-helpers";

type StudentProgramPaymentCardProps = {
  student: any;
  purchase: any;
  paymentStatuses: any[];
  cohorts: any[];
  onRefresh: () => void;
};

export function StudentProgramPaymentCard({
  student,
  purchase,
  paymentStatuses,
  cohorts,
  onRefresh,
}: StudentProgramPaymentCardProps) {
  const course = purchase.course;
  const courseStats = purchase.courseStats || {};

  const paymentStatus =
    paymentStatuses.find((status: any) => status.courseId === course?.id) ||
    null;

  const courseCohorts = getCohortsForCourse(student, course?.id);
  const activeCohort = courseCohorts.find((item: any) => item.isActive);

  const installments =
    courseStats.installments || paymentStatus?.paymentInstallments || [];

  const amountPaid = Number(
    paymentStatus?.totals?.paidAmount ?? courseStats.amountPaid ?? 0,
  );

  const totalAmount = Number(
    paymentStatus?.totals?.expectedAmount ?? courseStats.totalAmount ?? 0,
  );

  const pendingAmount = Number(
    paymentStatus?.totals?.pendingAmount ??
      courseStats.pendingAmount ??
      Math.max(totalAmount - amountPaid, 0),
  );

  const amountPaidDisplay =
    paymentStatus?.totals?.paidAmountFormatted ||
    courseStats.amountPaidFormatted;

  const totalAmountDisplay =
    paymentStatus?.totals?.expectedAmountFormatted ||
    courseStats.totalAmountFormatted;

  const pendingAmountDisplay =
    paymentStatus?.totals?.pendingAmountFormatted ||
    courseStats.pendingAmountFormatted;

  const statusLabel =
    courseStats.paymentStatus || paymentStatus?.status || "UNKNOWN";

  const planLabel =
    courseStats.paymentPlan || paymentStatus?.paymentPlan || "FULL_PAYMENT";

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-indigo-100">
      <div className="space-y-5">
        {/* ROW 1: title */}
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">
            {course?.title || "Untitled Course"}
          </h3>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            <span>{activeCohort?.cohort?.name || "No active cohort"}</span>
          </div>
        </div>

        {/* ROW 2: payment status + plan + actions */}
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill
              className={
                pendingAmount <= 0
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }
            >
              {statusLabel}
            </StatusPill>

            <StatusPill className="bg-indigo-50 text-indigo-600">
              {planLabel.replace(/_/g, " ")}
            </StatusPill>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ChangeStudentCourseCohortModal
              studentId={student.id}
              courseId={course.id}
              cohorts={cohorts.filter((cohort: any) => {
                const cohortCourseId =
                  cohort.courseId || cohort.course?.id || "";
                return cohortCourseId === course.id;
              })}
              onSuccess={onRefresh}
            />

            <RemoveStudentCourseModal
              studentId={student.id}
              courseId={course.id}
              courseTitle={course.title}
              onSuccess={onRefresh}
            />
          </div>
        </div>

        {/* ROW 3: summary cards */}
        <div className="grid gap-3 md:grid-cols-3">
          <PaymentMetric
            label="Amount Paid"
            value={amountPaidDisplay}
            icon={<Banknote className="h-4 w-4" />}
            tone="success"
          />

          <PaymentMetric
            label="Pending"
            value={pendingAmountDisplay}
            icon={<WalletCards className="h-4 w-4" />}
            tone={pendingAmount > 0 ? "warning" : "success"}
          />

          <PaymentMetric
            label="Total"
            value={totalAmountDisplay}
            icon={<CreditCard className="h-4 w-4" />}
            tone="neutral"
          />
        </div>

        {/* ROW 4: installments */}
        {installments.length > 0 && (
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Payment installments
            </p>

            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {installments.map((installment: any, index: number) => (
                <div
                  key={installment.id || index}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-3"
                >
                  <div>
                    <p className="text-xs font-black text-slate-900">
                      Installment #{installment.installmentNumber || index + 1}
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-400">
                      {installment.dueDate
                        ? formatDate(installment.dueDate)
                        : "No due date"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-black text-slate-900">
                      {installment.displayAmountFormatted ||
                        formatMoneyAmount(
                          Number(
                            installment.displayAmount ??
                              installment.amount ??
                              0,
                          ),
                          installment.displayCurrency,
                        )}
                    </p>

                    <span
                      className={cn(
                        "mt-1 inline-flex rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider",
                        installment.paid
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600",
                      )}
                    >
                      {installment.paid ? "Paid" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentMetric({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone: "success" | "warning" | "neutral";
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div
        className={cn(
          "mb-3 flex h-9 w-9 items-center justify-center rounded-xl",
          tone === "success" && "bg-emerald-50 text-emerald-600",
          tone === "warning" && "bg-amber-50 text-amber-600",
          tone === "neutral" && "bg-indigo-50 text-indigo-600",
        )}
      >
        {icon}
      </div>

      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-base font-black text-slate-900">{value}</p>
    </div>
  );
}

function StatusPill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider",
        className,
      )}
    >
      {children}
    </span>
  );
}

function getCohortsForCourse(student: any, courseId: string) {
  return (student.cohorts || []).filter((item: any) => {
    const cohortCourseId =
      item.cohort?.courseId ||
      item.cohort?.course?.id ||
      item.cohort?.cohortCourse?.courseId;

    return cohortCourseId === courseId;
  });
}
