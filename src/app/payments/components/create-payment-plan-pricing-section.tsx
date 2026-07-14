import { ReactNode } from "react";

import { CreatePaymentPlanSectionCard } from "./create-payment-plan-section-card";
import { CreatePaymentPlanSelectField } from "./create-payment-plan-select-field";
import { CourseOption, PricingPlanOption } from "../new/types";

type CreatePaymentPlanPricingSectionProps = {
  icon: ReactNode;
  selectedCourse: CourseOption | null;
  selectedPricingPlan: PricingPlanOption | null;
  planType: string;
  onPlanChange: (value: string) => void;
};

export function CreatePaymentPlanPricingSection({
  icon,
  selectedCourse,
  planType,
  onPlanChange,
}: CreatePaymentPlanPricingSectionProps) {
  return (
    <CreatePaymentPlanSectionCard
      icon={icon}
      title="Pricing Plan"
      description="The selected course pricing plan determines the installment amount and count."
    >
      <CreatePaymentPlanSelectField
        label="Pricing Plan"
        value={planType}
        onChange={onPlanChange}
        placeholder={
          selectedCourse ? "Select pricing plan" : "Select course first"
        }
        disabled={!selectedCourse}
        options={(selectedCourse?.pricingPlans || []).map((plan) => ({
          value: plan.planType,
          label: `${plan.planType.replace(/_/g, " ")} — ${
            plan.installmentsCount
          } installment${plan.installmentsCount > 1 ? "s" : ""}`,
        }))}
      />

      {selectedCourse && selectedCourse.pricingPlans.length === 0 && (
        <p className="text-xs font-bold text-rose-600 bg-rose-50 rounded-2xl px-4 py-3">
          This course does not have pricing plans set up yet.
        </p>
      )}
      {/* 
      {selectedPricingPlan && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <CreatePaymentPlanMiniMetric
            label="Installments"
            value={String(selectedPricingPlan.installmentsCount)}
          />

          <CreatePaymentPlanMiniMetric
            label="Per Installment"
            value={formatPrice(selectedPricingPlan.amountPerInstallment)}
          />
        </div>
      )} */}
    </CreatePaymentPlanSectionCard>
  );
}
