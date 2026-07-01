import { formatPrice } from "@/lib/utils";
import { PaymentPlansSummary } from "../hooks/use-payment-plans";

type PaymentPlansSummaryCardsProps = {
  summary: PaymentPlansSummary;
};

export function PaymentPlansSummaryCards({
  summary,
}: PaymentPlansSummaryCardsProps) {
  const cards = [
    {
      label: "Expected",
      value: summary.expected,
    },
    {
      label: "Collected",
      value: summary.collected,
    },
    {
      label: "Outstanding",
      value: summary.outstanding,
    },
    {
      label: "Overdue",
      value: summary.overdue,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm"
        >
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {card.label}
          </p>

          <p className="text-xl font-black text-slate-900 mt-2">
            {formatPrice(card.value)}
          </p>
        </div>
      ))}
    </div>
  );
}
