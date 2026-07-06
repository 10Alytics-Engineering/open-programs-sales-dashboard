"use client";

import { useMemo, useState } from "react";
import { Loader2, PlusCircle, X } from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/axios";
import { Field } from "./form-field";

type AddStudentCourseModalProps = {
  studentId: string;
  courses: any[];
  cohorts: any[];
  onSuccess: () => void;
};

export function AddStudentCourseModal({
  studentId,
  courses,
  cohorts,
  onSuccess,
}: AddStudentCourseModalProps) {
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [cohortId, setCohortId] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredCohorts = useMemo(() => {
    if (!courseId) return [];

    return cohorts.filter((cohort: any) => {
      const cohortCourseId =
        cohort.courseId || cohort.course?.id || cohort.cohortCourse?.courseId;

      return cohortCourseId === courseId;
    });
  }, [cohorts, courseId]);

  const closeModal = () => {
    if (loading) return;

    setOpen(false);
    setCourseId("");
    setCohortId("");
  };

  const handleSubmit = async () => {
    if (!courseId) {
      toast.error("Please select a course");
      return;
    }

    if (!cohortId) {
      toast.error("Please select a cohort");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/users/${studentId}/add-course`, {
        courseId,
        cohortId,
      });

      toast.success("Course added successfully");
      await onSuccess();
      closeModal();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to add course",
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
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-indigo-700"
      >
        <PlusCircle className="h-4 w-4" />
        Add Course
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Add Course Access
                </h3>
                <p className="mt-1 text-xs font-bold text-slate-400">
                  Assign this student to a course and cohort.
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
              <Field label="Course">
                <select
                  value={courseId}
                  disabled={loading}
                  onChange={(event) => {
                    setCourseId(event.target.value);
                    setCohortId("");
                  }}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
                >
                  <option value="">Select course</option>
                  {courses.map((course: any) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Cohort">
                <select
                  value={cohortId}
                  disabled={!courseId || loading}
                  onChange={(event) => setCohortId(event.target.value)}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
                >
                  <option value="">
                    {courseId ? "Select cohort" : "Select course first"}
                  </option>

                  {filteredCohorts.map((cohort: any) => (
                    <option key={cohort.id} value={cohort.id}>
                      {cohort.name}
                    </option>
                  ))}
                </select>

                {courseId && filteredCohorts.length === 0 && (
                  <p className="text-xs font-bold text-amber-600">
                    No cohorts found for this course.
                  </p>
                )}
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
                {loading ? "Adding..." : "Add Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
