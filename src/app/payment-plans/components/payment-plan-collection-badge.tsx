import { cn } from "@/lib/utils";
import { PaymentCollectionStatus } from "@/types";

const statusMap: Record<
  PaymentCollectionStatus,
  {
    label: string;
    description: string;
    className: string;
  }
> = {
  PENDING: {
    label: "Pending",
    description: "Not overdue",
    className: "bg-slate-100 text-slate-600",
  },
  OVERDUE_GRACE: {
    label: "Overdue Grace",
    description: "1–6 days overdue",
    className: "bg-amber-50 text-amber-600",
  },
  DEFAULTED: {
    label: "Defaulted",
    description: "7–44 days overdue",
    className: "bg-orange-50 text-orange-600",
  },
  BAD_DEBT: {
    label: "Bad Debt",
    description: "45+ days overdue",
    className: "bg-rose-50 text-rose-600",
  },
  COMPLETED: {
    label: "Completed",
    description: "Fully paid",
    className: "bg-emerald-50 text-emerald-600",
  },
  EXPIRED: {
    label: "Expired",
    description: "Expired plan",
    className: "bg-slate-900 text-white",
  },
};

type PaymentPlanCollectionBadgeProps = {
  status?: PaymentCollectionStatus | string | null;
  days?: number | null;
};

export function PaymentPlanCollectionBadge({
  status,
  days,
}: PaymentPlanCollectionBadgeProps) {
  const safeStatus = isCollectionStatus(status) ? status : "PENDING";
  const config = statusMap[safeStatus];

  return (
    <span
      title={config.description}
      className={cn(
        "inline-flex w-fit items-center rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider",
        config.className,
      )}
    >
      {config.label}
      {days && days > 0 ? ` • ${days}d` : ""}
    </span>
  );
}

function isCollectionStatus(
  status: unknown,
): status is PaymentCollectionStatus {
  return (
    status === "PENDING" ||
    status === "OVERDUE_GRACE" ||
    status === "DEFAULTED" ||
    status === "BAD_DEBT" ||
    status === "COMPLETED" ||
    status === "EXPIRED"
  );
}
