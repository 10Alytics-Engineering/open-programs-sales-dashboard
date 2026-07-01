import { BookOpen, CalendarClock, CreditCard, User } from "lucide-react";
import { CreatePaymentPlanWorkflow } from "../hooks/use-create-payment-plan";
import { CreatePaymentPlanStudentSection } from "./create-payment-plan-student-section";
import { CreatePaymentPlanCourseSection } from "./create-payment-plan-course-section";
import { CreatePaymentPlanPricingSection } from "./create-payment-plan-pricing-section";
import { CreatePaymentPlanNotesSection } from "./create-payment-plan-notes-section";

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

      <CreatePaymentPlanNotesSection
        icon={<CalendarClock className="w-5 h-5" />}
        notes={workflow.form.notes}
        onNotesChange={(value) => workflow.setField("notes", value)}
      />
    </div>
  );
}
