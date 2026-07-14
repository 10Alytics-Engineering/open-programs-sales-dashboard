import { ReactNode } from "react";
import { CreatePaymentPlanSectionCard } from "./create-payment-plan-section-card";

type CreatePaymentPlanStudentSectionProps = {
  icon: ReactNode;
  email: string;
  disabled?: boolean;
  onEmailChange: (value: string) => void;
};

export function CreatePaymentPlanStudentSection({
  icon,
  email,
  disabled,
  onEmailChange,
}: CreatePaymentPlanStudentSectionProps) {
  return (
    <CreatePaymentPlanSectionCard
      icon={icon}
      title="Student"
      description="Enter the email address of the student this payment plan belongs to."
    >
      <label className="block space-y-2">
        <span className="text-xs font-black uppercase tracking-widest text-slate-400">
          Student Email
        </span>

        <input
          type="email"
          value={email}
          disabled={disabled}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="student@example.com"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </label>
    </CreatePaymentPlanSectionCard>
  );
}
