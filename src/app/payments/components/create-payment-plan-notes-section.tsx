import { ReactNode } from "react";
import { CreatePaymentPlanSectionCard } from "./create-payment-plan-section-card";

type CreatePaymentPlanNotesSectionProps = {
  icon: ReactNode;
  notes: string;
  onNotesChange: (value: string) => void;
};

export function CreatePaymentPlanNotesSection({
  icon,
  notes,
  onNotesChange,
}: CreatePaymentPlanNotesSectionProps) {
  return (
    <CreatePaymentPlanSectionCard
      icon={icon}
      title="Notes"
      description="Optional internal note for finance records."
    >
      <textarea
        value={notes}
        onChange={(event) => onNotesChange(event.target.value)}
        rows={4}
        placeholder="Add note..."
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
      />
    </CreatePaymentPlanSectionCard>
  );
}
