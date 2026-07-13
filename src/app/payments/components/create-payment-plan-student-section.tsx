import { ReactNode } from "react";
import { UserOption } from "../new/types";
import { CreatePaymentPlanSectionCard } from "./create-payment-plan-section-card";
import { CreatePaymentPlanSelectField } from "./create-payment-plan-select-field";

type CreatePaymentPlanStudentSectionProps = {
  icon: ReactNode;
  users: UserOption[];
  userId: string;
  disabled?: boolean;
  onUserChange: (value: string) => void;
};

export function CreatePaymentPlanStudentSection({
  icon,
  users,
  userId,
  onUserChange,
  disabled,
}: CreatePaymentPlanStudentSectionProps) {
  return (
    <CreatePaymentPlanSectionCard
      icon={icon}
      title="Student"
      description="Choose the user this payment plan belongs to."
    >
      <CreatePaymentPlanSelectField
        label="User"
        value={userId}
        onChange={onUserChange}
        placeholder="Select user"
        disabled={disabled}
        options={users.map((user) => ({
          value: user.id,
          label: `${user.name}${user.email ? ` — ${user.email}` : ""}`,
        }))}
      />
    </CreatePaymentPlanSectionCard>
  );
}
