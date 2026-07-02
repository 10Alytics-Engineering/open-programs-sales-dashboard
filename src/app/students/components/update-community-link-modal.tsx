"use client";

import * as React from "react";
import { Link2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

type UpdateCommunityLinkModalProps = {
  trigger?: React.ReactNode;
};

export function UpdateCommunityLinkModal({
  trigger,
}: UpdateCommunityLinkModalProps) {
  const [open, setOpen] = React.useState(false);
  const [communityLink, setCommunityLink] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const closeModal = () => {
    setOpen(false);
    setCommunityLink("");
  };

  const handleSubmit = async () => {
    if (!communityLink) {
      toast.error("Community link is required");
      return;
    }

    try {
      new URL(communityLink);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    setLoading(true);

    try {
      await api.put("/api/admin/community-link", {
        communityLink,
      });

      toast.success("Community link updated successfully");
      closeModal();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.error || "Failed to update community link",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>

      {open && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-indigo-600" />
                  Update Community Link
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-1">
                  Update the active student community URL.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                Community Link URL
              </span>

              <input
                type="url"
                value={communityLink}
                onChange={(event) => setCommunityLink(event.target.value)}
                placeholder="https://whats.gg/your-community-link"
                className="w-full rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
              />

              <p className="text-xs font-medium text-slate-400">
                Enter the URL for WhatsApp, Slack, Discord or another community
                platform.
              </p>
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
                {loading ? "Updating..." : "Update Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
