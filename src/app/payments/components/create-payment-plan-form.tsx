import { BookOpen, CalendarClock, CreditCard, User } from "lucide-react";
import { CreatePaymentPlanWorkflow } from "../hooks/use-create-payment-plan";
import { CreatePaymentPlanStudentSection } from "./create-payment-plan-student-section";
import { CreatePaymentPlanCourseSection } from "./create-payment-plan-course-section";
import { CreatePaymentPlanPricingSection } from "./create-payment-plan-pricing-section";
import { CreatePaymentPlanNotesSection } from "./create-payment-plan-notes-section";
import { CreatePaymentPlanSectionCard } from "./create-payment-plan-section-card";
import { CreatePaymentPlanSelectField } from "./create-payment-plan-select-field";

type CreatePaymentPlanFormProps = {
  workflow: CreatePaymentPlanWorkflow;
};

export function CreatePaymentPlanForm({
  workflow,
}: CreatePaymentPlanFormProps) {
  return (
    <div className="space-y-6">
      <CreatePaymentPlanStudentSection
        icon={<User className="w-5 h-5" />}
        users={workflow.users}
        userId={workflow.form.userId}
        onUserChange={(value) => workflow.setField("userId", value)}
        disabled={Boolean(workflow.lockedUserId)}
      />

      <CreatePaymentPlanCourseSection
        icon={<BookOpen className="w-5 h-5" />}
        courses={workflow.courses}
        selectedCourse={workflow.selectedCourse}
        courseId={workflow.form.courseId}
        cohortId={workflow.form.cohortId}
        onCourseChange={(value) => workflow.setField("courseId", value)}
        onCohortChange={(value) => workflow.setField("cohortId", value)}
      />

      <CreatePaymentPlanPricingSection
        icon={<CreditCard className="w-5 h-5" />}
        selectedCourse={workflow.selectedCourse}
        selectedPricingPlan={workflow.selectedPricingPlan}
        planType={workflow.form.planType}
        onPlanChange={(value) => workflow.setField("planType", value)}
      />

      <CreatePaymentPlanSectionCard
        icon={<CreditCard className="w-5 h-5" />}
        title="Payment Currency"
        description="This currency will determine the gateway used for all transactions under this payment plan."
      >
        <CreatePaymentPlanSelectField
          label="Currency"
          value={workflow.form.currency}
          onChange={(value) => workflow.setField("currency", value)}
          placeholder="Select currency"
          options={[
            { value: "NGN", label: "NGN - Paystack" },
            { value: "USD", label: "USD - Stripe" },
            { value: "GBP", label: "GBP - Stripe" },
            { value: "GHS", label: "GHS - Start Button" },
            { value: "RWF", label: "RWF - Start Button" },
            { value: "UGX", label: "UGX - Start Button" },
          ]}
        />
      </CreatePaymentPlanSectionCard>

      <CreatePaymentPlanNotesSection
        icon={<CalendarClock className="w-5 h-5" />}
        notes={workflow.form.notes}
        onNotesChange={(value) => workflow.setField("notes", value)}
      />
    </div>
  );
}
