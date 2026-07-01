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

export type Transaction = {
  id: string;
  transactionRef?: string | null;
  userId: string;
  courseId: string;
  paymentType?: string | null;
  paymentPlan?: string | null;
  paymentStatusId?: string | null;
  amount: string | number;
  status: string;
  paymentDate?: string | null;
  authorizationUrl?: string | null;
  metadata?: string | null;
  createdAt: string;
  updatedAt: string;
  source?: "paystack" | "unified";
  paymentGateway?: "PAYSTACK" | "STRIPE" | "START_BUTTON";

  metadataParsed?: Record<string, any>;
  isInstallmentPayment?: boolean;
  matchedInstallment?: {
    id: string;
    amount: number;
    dueDate: string;
    paid: boolean;
    installmentNumber: number;
  } | null;

  paymentStatus?: {
    id?: string;
    status?: string;
    paymentPlan?: string | null;
    user?: {
      id: string;
      name: string;
      email?: string | null;
      phone_number?: string | null;
    } | null;
    course?: {
      id: string;
      title: string;
      price?: string | null;
    } | null;
    cohort?: {
      id: string;
      name: string;
    } | null;
  } | null;
};

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

export interface PaymentPlanTotals {
  expectedAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  installmentExpected: number;
}

export interface PaymentPlanRecord extends PaymentStatus {
  state: "paid_in_full" | "overdue" | "in_progress" | "pending" | "expired";
  expectedAmount?: number;
  currency?: string;
  notes?: string;
  manuallyCreated?: boolean;
  totals: PaymentPlanTotals;
  installmentSummary: {
    total: number;
    paid: number;
    unpaid: number;
    overdue: number;
  };
  transactions: Transaction[];
  paystackTransactions?: Transaction[];
}

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};
