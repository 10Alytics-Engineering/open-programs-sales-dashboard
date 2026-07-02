"use client";

import * as React from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/axios";
import { CohortOption, CourseOption } from "../types";
import { USER_ROLES } from "@/constants";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email."),
  phone_number: z.string().min(1, "Phone number is required."),
  role: z.string().min(1, "Role is required."),
  courseId: z.string().min(1, "Course is required."),
  cohortId: z.string().min(1, "Cohort is required."),
});

type AddStudentModalProps = {
  courses: CourseOption[];
  cohorts: CohortOption[];
  onSuccess?: () => void;
  trigger?: React.ReactNode;
};

export function AddStudentModal({
  courses,
  cohorts,
  onSuccess,
  trigger,
}: AddStudentModalProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      role: "USER",
      courseId: "",
      cohortId: "",
    },
  });

  const selectedCourseId = form.watch("courseId");

  const filteredCohorts = React.useMemo(() => {
    return cohorts.filter((cohort) => cohort.courseId === selectedCourseId);
  }, [cohorts, selectedCourseId]);

  React.useEffect(() => {
    const currentCohortId = form.getValues("cohortId");

    if (
      currentCohortId &&
      !filteredCohorts.some((cohort) => cohort.id === currentCohortId)
    ) {
      form.setValue("cohortId", "");
    }
  }, [filteredCohorts, form]);

  const closeModal = () => {
    setOpen(false);
    form.reset();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      await api.post("/admin/users", values);
      toast.success("Student created successfully");
      onSuccess?.();
      closeModal();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.error || "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>

      {open && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Add Student
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-1">
                  Create a student and assign them to a course cohort.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  label="Full Name"
                  error={form.formState.errors.name?.message}
                >
                  <input
                    {...form.register("name")}
                    placeholder="John Doe"
                    className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </Field>

                <Field
                  label="Email"
                  error={form.formState.errors.email?.message}
                >
                  <input
                    {...form.register("email")}
                    placeholder="john@example.com"
                    className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </Field>
              </div>

              <Field
                label="Phone Number"
                error={form.formState.errors.phone_number?.message}
              >
                <input
                  {...form.register("phone_number")}
                  placeholder="+234..."
                  className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </Field>

              <Field label="Role" error={form.formState.errors.role?.message}>
                <select
                  {...form.register("role")}
                  className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {USER_ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  label="Course"
                  error={form.formState.errors.courseId?.message}
                >
                  <select
                    {...form.register("courseId")}
                    className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">Select course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Cohort"
                  error={form.formState.errors.cohortId?.message}
                >
                  <select
                    {...form.register("cohortId")}
                    disabled={!selectedCourseId}
                    className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
                  >
                    <option value="">
                      {selectedCourseId
                        ? "Select cohort"
                        : "Select course first"}
                    </option>
                    {filteredCohorts.map((cohort) => (
                      <option key={cohort.id} value={cohort.id}>
                        {cohort.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="rounded-2xl px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Creating..." : "Create Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-black uppercase tracking-widest text-slate-400">
        {label}
      </span>
      {children}
      {error && <p className="text-xs font-bold text-rose-600">{error}</p>}
    </label>
  );
}
