"use client";

import { useState } from "react";
import { Loader2, RefreshCcw, X } from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/axios";
import { Field } from "./form-field";

type ChangeStudentCourseCohortModalProps = {
  studentId: string;
  courseId: string;
  cohorts: any[];
  onSuccess: () => void;
};

export function ChangeStudentCourseCohortModal({
  studentId,
  courseId,
  cohorts,
  onSuccess,
}: ChangeStudentCourseCohortModalProps) {
  const [open, setOpen] = useState(false);
  const [cohortId, setCohortId] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    if (loading) return;

    setOpen(false);
    setCohortId("");
    setReason("");
  };

  const handleSubmit = async () => {
    if (!cohortId) {
      toast.error("Please select a cohort");
      return;
    }

    try {
      setLoading(true);

      await api.patch(`/users/${studentId}/update-cohort`, {
        courseId,
        cohortId,
        reason,
      });

      toast.success("Cohort changed successfully");
      await onSuccess();
      closeModal();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to change cohort",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <RefreshCcw className="h-4 w-4" />
        Change Cohort
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Change Course Cohort
                </h3>
                <p className="mt-1 text-xs font-bold text-slate-400">
                  Move this student to another cohort for this course.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <Field label="New Cohort">
                <select
                  value={cohortId}
                  disabled={loading}
                  onChange={(event) => setCohortId(event.target.value)}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
                >
                  <option value="">Select new cohort</option>
                  {cohorts.map((cohort: any) => (
                    <option key={cohort.id} value={cohort.id}>
                      {cohort.name}
                    </option>
                  ))}
                </select>

                {cohorts.length === 0 && (
                  <p className="text-xs font-bold text-amber-600">
                    No cohorts found for this course.
                  </p>
                )}
              </Field>

              <Field label="Reason">
                <textarea
                  value={reason}
                  disabled={loading}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Reason for switching cohort..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
                />
              </Field>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-5">
              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="rounded-2xl px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Changing..." : "Change Cohort"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
