export type UserOption = {
  id: string;
  name: string;
  email?: string | null;
  phone_number?: string | null;
};

export type CohortOption = {
  id: string;
  name: string;
  startDate?: string | null;
  endDate?: string | null;
};

export type PricingPlanOption = {
  id: string;
  courseId: string;
  planType: string;
  amountPerInstallment: number;
  installmentsCount: number;
  discountPrice?: number | null;
};

export type CourseOption = {
  id: string;
  title: string;
  price?: string | null;
  discount?: string | null;
  cohorts: CohortOption[];
  pricingPlans: PricingPlanOption[];
};

export type PaymentPlanPreviewData = {
  expectedAmount: number;
  pricingPlan: PricingPlanOption;
  installments: Array<{
    amount: number;
    dueDate: string;
    installmentNumber: number;
  }>;
};

export type CreatePaymentPlanFormState = {
  userId: string;
  courseId: string;
  cohortId: string;
  planType: string;
  notes: string;
};
