import { cn } from "@/lib/utils";

const PaymentStatus = ({ payment }: { payment: any }) => {
  let displayStatus = "";
  if (payment.status !== "success") {
    displayStatus = payment.status;
  } else if (payment.status === "success" && payment.planComplete) {
    displayStatus = "success";
  } else if (payment.status === "success" && !payment.planComplete) {
    displayStatus = "in_progress";
  }

  const styles = {
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    in_progress: "bg-indigo-50 text-indigo-600 border-indigo-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    failed: "bg-rose-50 text-rose-600 border-rose-100",
    expired: "bg-rose-50 text-rose-600 border-rose-100",
  } as const;

  const label =
    displayStatus === "in_progress" && payment.installmentProgress
      ? `${payment.installmentProgress.paid}/${payment.installmentProgress.total} Success`
      : displayStatus;

  return (
    <span
      className={cn(
        "px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap border",
        styles[displayStatus as keyof typeof styles] ?? styles.failed,
      )}
    >
      {label}
    </span>
  );
};

export default PaymentStatus;
