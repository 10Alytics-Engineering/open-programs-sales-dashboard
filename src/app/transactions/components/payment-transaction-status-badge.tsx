import { cn } from "@/lib/utils";

type PaymentTransactionStatusBadgeProps = {
  status: string;
};

export function PaymentTransactionStatusBadge({
  status,
}: PaymentTransactionStatusBadgeProps) {
  const normalizedStatus = status?.toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
        normalizedStatus === "success" && "bg-emerald-100 text-emerald-700",
        normalizedStatus === "pending" && "bg-amber-100 text-amber-700",
        ["failed", "expired"].includes(normalizedStatus) &&
          "bg-rose-100 text-rose-700",
        !["success", "pending", "failed", "expired"].includes(
          normalizedStatus,
        ) && "bg-slate-100 text-slate-600",
      )}
    >
      {normalizedStatus || "unknown"}
    </span>
  );
}
