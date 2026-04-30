export interface User {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  role: string;
  createdAt: string;
  paymentStatus?: PaymentStatus[];
}

export interface Course {
  id: string;
  title: string;
  price: string;
}

export interface Cohort {
  id: string;
  name: string;
}

export interface PaymentStatus {
  id: string;
  status: string;
  paymentPlan: string;
  paymentType?: string;
  userId: string;
  courseId: string;
  cohortId?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  course?: Course;
  cohort?: Cohort;
  paymentInstallments?: PaymentInstallment[];
}

export interface PaymentInstallment {
  id: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  installmentNumber: number;
}

export interface Transaction {
  id: string;
  transactionRef: string;
  userId: string;
  courseId: string;
  amount: string;
  status: string;
  paymentDate: string;
  source?: string;
  paymentPlan?: string;
  paymentGateway?: string;
  metadata?: string;
  paymentStatus?: PaymentStatus;
}

export interface DashboardSummary {
  currentRevenue: number;
  previousRevenue: number;
  growthPercentage: number;
  transactions: number;
  averageTransaction: number;
  activityStats: {
    total: number;
    success: number;
    pending: number;
    failed: number;
  };
  activeDuration: string;
}

export interface TopCourse {
  id: string;
  title: string;
  revenue: number;
  enrollments: number;
}

export interface PaymentPlanDistribution {
  paymentPlan: string;
  count: number;
  revenue: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  topCourses: TopCourse[];
  paymentPlanDistribution: PaymentPlanDistribution[];
  period: {
    type: string;
    current: { start: string; end: string };
    previous: { start: string; end: string };
  };
}
