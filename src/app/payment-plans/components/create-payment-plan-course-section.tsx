import { ReactNode } from "react";
import { CreatePaymentPlanSectionCard } from "./create-payment-plan-section-card";
import { CreatePaymentPlanSelectField } from "./create-payment-plan-select-field";
import { formatDate } from "@/lib/utils";
import { CourseOption } from "../new/types";

type CreatePaymentPlanCourseSectionProps = {
  icon: ReactNode;
  courses: CourseOption[];
  selectedCourse: CourseOption | null;
  courseId: string;
  cohortId: string;
  onCourseChange: (value: string) => void;
  onCohortChange: (value: string) => void;
};

export function CreatePaymentPlanCourseSection({
  icon,
  courses,
  selectedCourse,
  courseId,
  cohortId,
  onCourseChange,
  onCohortChange,
}: CreatePaymentPlanCourseSectionProps) {
  return (
    <CreatePaymentPlanSectionCard
      icon={icon}
      title="Course & Cohort"
      description="Select the course first, then pick a cohort attached to that course."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CreatePaymentPlanSelectField
          label="Course"
          value={courseId}
          onChange={onCourseChange}
          placeholder="Select course"
          options={courses.map((course) => ({
            value: course.id,
            label: course.title,
          }))}
        />

        <CreatePaymentPlanSelectField
          label="Cohort"
          value={cohortId}
          onChange={onCohortChange}
          placeholder={selectedCourse ? "Select cohort" : "Select course first"}
          disabled={!selectedCourse}
          options={(selectedCourse?.cohorts || []).map((cohort) => ({
            value: cohort.id,
            label: `${cohort.name}${
              cohort.startDate
                ? ` — starts ${formatDate(cohort.startDate)}`
                : ""
            }`,
          }))}
        />
      </div>

      {selectedCourse && selectedCourse.cohorts.length === 0 && (
        <p className="text-xs font-bold text-amber-600 bg-amber-50 rounded-2xl px-4 py-3">
          This course does not currently have any cohorts attached.
        </p>
      )}
    </CreatePaymentPlanSectionCard>
  );
}
