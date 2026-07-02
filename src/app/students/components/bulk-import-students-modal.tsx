"use client";

import * as React from "react";
import Papa from "papaparse";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { CohortOption, CourseOption } from "../types";

type BulkImportStudentsModalProps = {
  courses: CourseOption[];
  cohorts: CohortOption[];
  onSuccess?: () => void;
  trigger?: React.ReactNode;
};

export function BulkImportStudentsModal({
  courses,
  cohorts,
  onSuccess,
  trigger,
}: BulkImportStudentsModalProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [courseId, setCourseId] = React.useState("");
  const [cohortId, setCohortId] = React.useState("");
  const [userData, setUserData] = React.useState("");
  const [validationErrors, setValidationErrors] = React.useState<
    Array<{ line: number; errors: string[] }>
  >([]);

  const filteredCohorts = React.useMemo(() => {
    return cohorts.filter((cohort) => cohort.courseId === courseId);
  }, [cohorts, courseId]);

  React.useEffect(() => {
    if (cohortId && !filteredCohorts.some((cohort) => cohort.id === cohortId)) {
      setCohortId("");
    }
  }, [filteredCohorts, cohortId]);

  const closeModal = () => {
    setOpen(false);
    setCourseId("");
    setCohortId("");
    setUserData("");
    setValidationErrors([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const data = results.data.map((row: any) => ({
          name: row.name || row.fullname || row["Full Name"],
          email: row.email || row["Email Address"],
          phone_number:
            row.phone || row.phone_number || row["Phone Number"] || "",
        }));

        const formattedData = data
          .filter((user: any) => user.name && user.email)
          .map(
            (user: any) =>
              `${user.name},${user.email},${user.phone_number || ""}`,
          )
          .join("\n");

        setUserData(formattedData);
        setValidationErrors([]);
      },
      error: (error) => {
        toast.error(error.message);
      },
    });
  };

  const validateUserData = () => {
    const errors: Array<{ line: number; errors: string[] }> = [];

    const lines = userData.split("\n").filter((line) => line.trim());

    lines.forEach((line, index) => {
      const lineErrors: string[] = [];
      const [name, email, phoneNumber = ""] = line
        .split(",")
        .map((item) => item.trim());

      if (!name) lineErrors.push("Missing name");
      if (!email) lineErrors.push("Missing email");
      if (!phoneNumber) lineErrors.push("Missing phone number");

      if (email && !zodEmail(email)) {
        lineErrors.push("Invalid email format");
      }

      if (lineErrors.length > 0) {
        errors.push({
          line: index + 1,
          errors: lineErrors,
        });
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    if (!courseId || !cohortId) {
      toast.error("Please select both course and cohort");
      return;
    }

    if (!userData.trim()) {
      toast.error("Please enter or upload user data");
      return;
    }

    if (!validateUserData()) {
      toast.error("Please fix validation errors before importing");
      return;
    }

    setLoading(true);

    try {
      const users = userData
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          const [name, email, phone_number = ""] = line
            .split(",")
            .map((item) => item.trim());

          return {
            name,
            email,
            phone_number,
          };
        });

      const response = await api.post("/admin/users/bulk", {
        users,
        courseId,
        cohortId,
      });

      toast.success(
        `Successfully created ${response.data.success || users.length} users`,
      );

      onSuccess?.();
      closeModal();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.error || "Failed to import students");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>

      {open && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Bulk Import Students
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-1">
                  Upload CSV or paste students in name,email,phone format.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Course">
                  <select
                    value={courseId}
                    onChange={(event) => setCourseId(event.target.value)}
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

                <Field label="Cohort">
                  <select
                    value={cohortId}
                    disabled={!courseId}
                    onChange={(event) => setCohortId(event.target.value)}
                    className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
                  >
                    <option value="">
                      {courseId ? "Select cohort" : "Select course first"}
                    </option>
                    {filteredCohorts.map((cohort) => (
                      <option key={cohort.id} value={cohort.id}>
                        {cohort.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Upload CSV File">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm font-bold"
                />
                <p className="mt-2 text-xs font-medium text-slate-400">
                  CSV columns: name, email, phone_number
                </p>
              </Field>

              <Field label="User Data">
                <textarea
                  value={userData}
                  onChange={(event) => setUserData(event.target.value)}
                  rows={8}
                  placeholder={`John Doe,john@example.com,1234567890\nJane Smith,jane@example.com,1234567878`}
                  className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </Field>

              {validationErrors.length > 0 && (
                <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
                  <p className="text-sm font-black text-rose-700">
                    Validation Errors
                  </p>

                  <div className="mt-2 space-y-1">
                    {validationErrors.map((error) => (
                      <p
                        key={error.line}
                        className="text-xs font-bold text-rose-600"
                      >
                        Line {error.line}: {error.errors.join(", ")}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-5">
              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="rounded-2xl px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Importing..." : "Import Students"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-black uppercase tracking-widest text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}

function zodEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
