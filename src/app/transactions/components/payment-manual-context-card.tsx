import { UserRoundCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

type PaymentManualContextCardProps = {
  metadata: Record<string, any>;
};

export function PaymentManualContextCard({
  metadata,
}: PaymentManualContextCardProps) {
  const isManual =
    metadata?.manualEntry === true || metadata?.manuallyMarkedPaid === true;

  if (!isManual) return null;

  return (
    <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 flex gap-4">
      <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
        <UserRoundCheck className="w-5 h-5" />
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">
            Manual Transaction
          </p>

          <h3 className="text-base font-black text-slate-900 mt-1">
            This transaction was created or marked as paid manually.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-bold text-slate-600">
          {metadata?.createdBy && (
            <p>
              <span className="text-slate-400">Created by:</span>{" "}
              {metadata.createdBy}
            </p>
          )}

          {metadata?.markedPaidBy && (
            <p>
              <span className="text-slate-400">Marked paid by:</span>{" "}
              {metadata.markedPaidBy}
            </p>
          )}

          {metadata?.markedPaidAt && (
            <p>
              <span className="text-slate-400">Marked paid at:</span>{" "}
              {formatDate(metadata.markedPaidAt)}
            </p>
          )}

          {(metadata?.manualReason || metadata?.notes) && (
            <p className="md:col-span-2">
              <span className="text-slate-400">Reason:</span>{" "}
              {metadata.manualReason || metadata.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
