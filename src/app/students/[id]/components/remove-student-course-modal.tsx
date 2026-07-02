"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/axios";

type RemoveStudentCourseModalProps = {
  studentId: string;
  courseId: string;
  courseTitle: string;
  onSuccess: () => void;
};

export function RemoveStudentCourseModal({
  studentId,
  courseId,
  courseTitle,
  onSuccess,
}: RemoveStudentCourseModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    if (loading) return;
    setOpen(false);
  };

  const handleRemove = async () => {
    try {
      setLoading(true);

      await api.delete(`/users/${studentId}/remove-course`, {
        data: {
          courseId,
        },
      });

      toast.success("Course removed successfully");
      await onSuccess();
      closeModal();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to remove course",
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
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-100 bg-white px-4 py-2.5 text-xs font-black text-rose-600 shadow-sm transition hover:bg-rose-50"
      >
        <Trash2 className="h-4 w-4" />
        Remove Course
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Remove Course Access
                </h3>
                <p className="mt-1 text-xs font-bold text-slate-400">
                  This will remove this course from the student profile.
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
              <div className="rounded-3xl border border-rose-100 bg-rose-50 p-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-rose-600">
                    <AlertTriangle className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-black text-rose-700">
                      Confirm course removal
                    </p>
                    <p className="mt-1 text-sm font-medium text-rose-600">
                      Are you sure you want to remove{" "}
                      <span className="font-black">{courseTitle}</span> from
                      this student?
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                  This action may remove
                </p>

                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm font-bold text-slate-600">
                  <li>Course access</li>
                  <li>Cohort enrollment</li>
                  <li>Related course/payment associations</li>
                </ul>
              </div>
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
                onClick={handleRemove}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black text-white transition hover:bg-rose-700 disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Removing..." : "Remove Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
