"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BadgeCheck,
  Ban,
  ChevronLeft,
  GraduationCap,
  Loader2,
  Mail,
  Phone,
  PlusCircle,
  RotateCcw,
  ShieldCheck,
  User,
  UserCog,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { ChangeStudentRoleModal } from "./change-student-role-modal";

type StudentProfileHeaderProps = {
  student: any;
  purchasedCoursesCount: number;
  transactionsCount: number;
  canChangeRole?: boolean;
  onRoleChanged?: () => void;
  onStatusChanged?: () => void;
};

export function StudentProfileHeader({
  student,
  purchasedCoursesCount,
  transactionsCount,
  canChangeRole = false,
  onRoleChanged,
  onStatusChanged,
}: StudentProfileHeaderProps) {
  const [processingStatus, setProcessingStatus] = useState(false);

  const isSuspended = Boolean(student.inactive);

  const handleStatusChange = async () => {
    try {
      setProcessingStatus(true);

      await api.patch(`/account-status/${student.id}/toggle-status`, {
        inactive: !isSuspended,
      });

      toast.success(isSuspended ? "Student reactivated" : "Student suspended");
      await onStatusChanged?.();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to update student status",
      );
    } finally {
      setProcessingStatus(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Link
          href="/students"
          className="group flex items-center gap-2 text-slate-500 transition-colors hover:text-indigo-600"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-white transition-all group-hover:border-indigo-100 group-hover:bg-indigo-50">
            <ChevronLeft className="h-5 w-5" />
          </div>

          <span className="text-sm font-bold tracking-tight">
            Return to Directory
          </span>
        </Link>

        <span
          className={cn(
            "rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-widest",
            isSuspended
              ? "border-rose-100 bg-rose-50 text-rose-600"
              : "border-emerald-100 bg-emerald-50 text-emerald-600",
          )}
        >
          {isSuspended ? "Suspended Student" : "Active Student"}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm md:rounded-[40px]">
        <div className="absolute right-0 top-0 h-48 w-48 -translate-y-16 translate-x-16 rounded-full bg-linear-to-br from-indigo-50/50 to-transparent md:h-80 md:w-80 md:-translate-y-32 md:translate-x-32" />

        <div className="relative z-10 p-6 md:p-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
            <div className="relative shrink-0 self-center xl:self-start">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-100 md:h-28 md:w-28 md:rounded-4xl">
                <User className="h-12 w-12 md:h-14 md:w-14" strokeWidth={1.5} />
              </div>

              <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-50 bg-white text-indigo-600 shadow-lg">
                <BadgeCheck className="h-5 w-5" fill="currentColor" />
                <ShieldCheck className="absolute h-5 w-5 text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1 space-y-5">
              <div className="space-y-4">
                <h1 className="text-center text-2xl font-black leading-none tracking-tight text-slate-900 md:text-4xl xl:text-left">
                  {student.name}
                </h1>

                <div className="flex flex-wrap items-center gap-3 xl:flex-nowrap">
                  {student.email && (
                    <InfoPill
                      className="min-w-0"
                      icon={<Mail className="h-3.5 w-3.5 text-indigo-500" />}
                    >
                      <span className="truncate">{student.email}</span>
                    </InfoPill>
                  )}

                  {student.phone_number && (
                    <InfoPill
                      className="min-w-0"
                      icon={<Phone className="h-3.5 w-3.5 text-indigo-500" />}
                    >
                      <span className="truncate">{student.phone_number}</span>
                    </InfoPill>
                  )}

                  <InfoPill
                    className="shrink-0"
                    icon={
                      <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />
                    }
                  >
                    <span>
                      {purchasedCoursesCount} Program
                      {purchasedCoursesCount === 1 ? "" : "s"}
                    </span>
                  </InfoPill>

                  <InfoPill
                    className="shrink-0"
                    icon={
                      <WalletCards className="h-3.5 w-3.5 text-indigo-500" />
                    }
                  >
                    <span>
                      {transactionsCount} Transaction
                      {transactionsCount === 1 ? "" : "s"}
                    </span>
                  </InfoPill>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-indigo-600">
                  <UserCog className="h-4 w-4" />
                  <span className="text-xs font-black uppercase tracking-widest">
                    {student.role?.replace(/_/g, " ") || "USER"}
                  </span>

                  {canChangeRole && onRoleChanged && (
                    <ChangeStudentRoleModal
                      studentId={student.id}
                      studentName={student.name}
                      currentRole={student.role || "USER"}
                      onSuccess={onRoleChanged}
                    />
                  )}
                </div>

                {canChangeRole && (
                  <button
                    type="button"
                    disabled={processingStatus}
                    onClick={handleStatusChange}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-xs font-black uppercase tracking-widest transition disabled:opacity-60 h-10",
                      isSuspended
                        ? " bg-emerald-700 text-white hover:bg-emerald-800"
                        : "bg-rose-700 text-white hover:bg-rose-800",
                    )}
                  >
                    {processingStatus ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isSuspended ? (
                      <RotateCcw className="h-4 w-4" />
                    ) : (
                      <Ban className="h-4 w-4" />
                    )}

                    {processingStatus
                      ? isSuspended
                        ? "Reactivating"
                        : "Suspending"
                      : isSuspended
                        ? "Reactivate Student"
                        : "Suspend Student"}
                  </button>
                )}

                <Link
                  href={`/payments/new?email=${encodeURIComponent(student.email || "")}`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-indigo-700"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Payment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoPill({
  icon,
  children,
  className,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-600",
        className,
      )}
    >
      {icon}
      {children}
    </div>
  );
}
