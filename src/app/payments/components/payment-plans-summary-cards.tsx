import { formatPrice } from "@/lib/utils";
import { PaymentPlansSummary } from "@/types";

type PaymentPlansSummaryCardsProps = {
  summary: PaymentPlansSummary;
};

export function PaymentPlansSummaryCards({
  summary,
}: PaymentPlansSummaryCardsProps) {
  const cards = [
    {
      label: "Expected",
      value: formatPrice(summary.expected),
      helper: "Total expected revenue",
    },
    {
      label: "Collected",
      value: formatPrice(summary.collected),
      helper: "Successful payments",
    },
    {
      label: "Outstanding",
      value: formatPrice(summary.outstanding),
      helper: "Expected minus collected",
    },
    {
      label: "Overdue",
      value: formatPrice(summary.overdue),
      helper: "Past due unpaid amount",
    },
    {
      label: "Pending",
      value: formatPrice(summary.pending.amount),
      helper: `${summary.pending.count} plan(s), not overdue`,
    },
    {
      label: "Overdue Grace",
      value: formatPrice(summary.overdueGrace.amount),
      helper: `${summary.overdueGrace.count} plan(s), 1–6 days`,
    },
    {
      label: "Defaulted",
      value: formatPrice(summary.defaulted.amount),
      helper: `${summary.defaulted.count} plan(s), 7–44 days`,
    },
    {
      label: "Bad Debt",
      value: formatPrice(summary.badDebt.amount),
      helper: `${summary.badDebt.count} plan(s), 45+ days`,
    },
    {
      label: "Completed",
      value: formatPrice(summary.completed.amount),
      helper: `${summary.completed.count} fully paid plan(s)`,
    },
    // {
    //   label: "Expired",
    //   value: formatPrice(summary.expired.amount),
    //   helper: `${summary.expired.count} expired plan(s)`,
    // },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm"
        >
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {card.label}
          </p>

          <p className="text-xl font-black text-slate-900 mt-2">{card.value}</p>

          <p className="text-[11px] font-bold text-slate-400 mt-1">
            {card.helper}
          </p>
        </div>
      ))}
    </div>
  );
}
