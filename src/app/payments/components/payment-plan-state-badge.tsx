import { cn } from "@/lib/utils";

type PaymentPlanStateBadgeProps = {
  state: string;
};

export function PaymentPlanStateBadge({ state }: PaymentPlanStateBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
        state === "paid_in_full" && "bg-emerald-100 text-emerald-700",
        state === "overdue" && "bg-rose-100 text-rose-700",
        state === "in_progress" && "bg-amber-100 text-amber-700",
        state === "pending" && "bg-slate-100 text-slate-600",
        state === "expired" && "bg-slate-900 text-white",
      )}
    >
      {state.replace(/_/g, " ")}
    </span>
  );
}
