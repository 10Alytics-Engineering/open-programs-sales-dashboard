import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const gatewayStyles: Record<
  string,
  {
    bg: string;
    text: string;
    border: string;
  }
> = {
  PAYSTACK: {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },
  STRIPE: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },
  START_BUTTON: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
};

type PaymentGatewayBadgeProps = {
  gateway?: string | null;
  source?: string | null;
};

export function PaymentGatewayBadge({
  gateway,
  source,
}: PaymentGatewayBadgeProps) {
  const resolvedGateway =
    gateway || (source === "paystack" ? "PAYSTACK" : "UNKNOWN");

  const normalizedGateway = resolvedGateway.toUpperCase();

  const style = gatewayStyles[normalizedGateway] || {
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
  };

  const label =
    normalizedGateway === "START_BUTTON"
      ? "Start Button"
      : normalizedGateway.toLowerCase() === "unknown"
        ? "Unknown"
        : normalizedGateway;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border",
        style.bg,
        style.text,
        style.border,
      )}
    >
      <CreditCard className="w-3 h-3" />
      {label}
    </span>
  );
}
