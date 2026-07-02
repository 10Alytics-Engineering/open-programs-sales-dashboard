"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil, ShieldAlert, X } from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/axios";
import { USER_ROLES } from "@/constants";
import { ModalPortal } from "@/components/shared/modal-portal";

type ChangeStudentRoleModalProps = {
  studentId: string;
  studentName: string;
  currentRole: string;
  onSuccess: () => void;
};

export function ChangeStudentRoleModal({
  studentId,
  studentName,
  currentRole,
  onSuccess,
}: ChangeStudentRoleModalProps) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(currentRole || "USER");
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    if (loading) return;

    setOpen(false);
    setRole(currentRole || "USER");
  };

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const handleSubmit = async () => {
    if (!role) {
      toast.error("Please select a role");
      return;
    }

    if (role === currentRole) {
      toast.info("No role change made");
      closeModal();
      return;
    }

    try {
      setLoading(true);

      await api.patch(`/users/${studentId}/update-role`, {
        role,
      });

      toast.success("Student role updated successfully");
      await onSuccess();
      closeModal();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to update role",
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
        className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white text-indigo-600 transition hover:bg-indigo-100"
        title="Change role"
      >
        <Pencil className="h-3 w-3" />
      </button>

      {open && (
        <ModalPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <div className="relative z-60 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Change Student Role
                  </h3>
                  <p className="mt-1 text-xs font-bold text-slate-400">
                    Update access role for {studentName}.
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
                <div className="rounded-3xl border border-amber-100 bg-amber-50 p-4">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-600">
                      <ShieldAlert className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-black text-amber-700">
                        Super admin action
                      </p>
                      <p className="mt-1 text-sm font-medium text-amber-700/80">
                        Changing a role can affect dashboard and admin access.
                        Confirm the selected role before saving.
                      </p>
                    </div>
                  </div>
                </div>

                <label className="block space-y-2">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Role
                  </span>

                  <select
                    value={role}
                    disabled={loading}
                    onChange={(event) => setRole(event.target.value)}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
                  >
                    {USER_ROLES.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
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
                  {loading ? "Saving..." : "Save Role"}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </>
  );
}
