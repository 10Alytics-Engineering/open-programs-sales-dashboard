"use client";

import Link from "next/link";
import {
  BookOpen,
  CalendarClock,
  ChevronRight,
  Mail,
  Phone,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { StudentUser } from "../types";

type StudentCardProps = {
  student: StudentUser;
  refreshData: () => void;
};

export function StudentCard({ student }: StudentCardProps) {
  const purchasedCourses = student.course_purchased || [];
  const userCohorts = student.cohorts || [];

  const getActiveCohortForCourse = (courseId?: string) => {
    if (!courseId) return null;

    return (
      userCohorts.find(
        (item) => item.courseId === courseId || item.course?.id === courseId,
      ) || null
    );
  };

  const getPaymentStatusForCourse = (courseId?: string) => {
    if (!courseId) return null;

    return (
      student.paymentStatus?.find(
        (status: any) => status.courseId === courseId,
      ) || null
    );
  };

  const getPaymentLabel = (paymentStatus: any) => {
    if (!paymentStatus) return "No Payment Plan";

    if (paymentStatus.collectionStatus === "COMPLETED") {
      return "Paid";
    }

    if (paymentStatus.collectionStatus === "PENDING") {
      return "Outstanding";
    }

    return String(paymentStatus.collectionStatus || "Outstanding").replace(
      /_/g,
      " ",
    );
  };

  const getPaymentTone = (paymentStatus: any) => {
    if (!paymentStatus) return "bg-slate-100 text-slate-600";

    if (paymentStatus.collectionStatus === "COMPLETED") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (
      paymentStatus.collectionStatus === "OVERDUE_GRACE" ||
      paymentStatus.collectionStatus === "DEFAULTED" ||
      paymentStatus.collectionStatus === "BAD_DEBT"
    ) {
      return "bg-rose-100 text-rose-700";
    }

    return "bg-amber-100 text-amber-700";
  };

  return (
    <div className="p-5 md:p-6 hover:bg-indigo-50/30 transition">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 font-black uppercase">
              {student.name?.slice(0, 1) || "S"}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-black text-slate-900 truncate">
                  {student.name || "Unknown Student"}
                </h3>

                <span
                  className={cn(
                    "inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest",
                    student.inactive
                      ? "bg-rose-100 text-rose-700"
                      : "bg-emerald-100 text-emerald-700",
                  )}
                >
                  {student.inactive ? "Inactive" : "Active"}
                </span>

                {student.role && (
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600">
                    {student.role.replace(/_/g, " ")}
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold text-slate-500">
                {student.email && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    {student.email}
                  </span>
                )}

                {student.phone_number && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    {student.phone_number}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Link
            href={`/students/${student.id}`}
            className="inline-flex items-center justify-center gap-1 rounded-2xl bg-white border border-slate-100 px-4 py-2.5 text-xs font-black text-indigo-600 hover:bg-indigo-50 transition shrink-0"
          >
            Details
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              Purchased Courses
            </p>
          </div>

          {purchasedCourses.length === 0 ? (
            <p className="text-sm font-bold text-slate-400">
              No purchased courses found.
            </p>
          ) : (
            <div className="space-y-3">
              {purchasedCourses.map((purchase) => {
                const course = purchase.course;
                const activeCohort = getActiveCohortForCourse(course?.id);
                const paymentStatus = getPaymentStatusForCourse(course?.id);

                return (
                  <div
                    key={purchase.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-2 rounded-2xl bg-white border border-slate-100 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-900 truncate">
                        {course?.title || "Untitled Course"}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarClock className="w-3.5 h-3.5" />
                          {activeCohort?.cohort?.name || "No active cohort"}
                        </span>
                      </div>
                    </div>

                    <span
                      className={cn(
                        "inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest",
                        getPaymentTone(paymentStatus),
                      )}
                    >
                      {getPaymentLabel(paymentStatus)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
