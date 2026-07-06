export type StudentUser = {
  id: string;
  name: string;
  email?: string | null;
  phone_number?: string | null;
  role?: string;
  inactive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  accountPaymentStatus?: string | null;

  cohorts?: Array<{
    id: string;
    courseId?: string;
    cohortId?: string;
    isPaymentActive?: boolean;
    cohort?: {
      id: string;
      name: string;
      startDate?: string | null;
      endDate?: string | null;
    };
    course?: {
      id: string;
      title: string;
    };
  }>;

  paymentStatus?: Array<{
    id: string;
    status: string;
    paymentPlan?: string | null;
    course?: {
      id: string;
      title: string;
    };
    cohort?: {
      id: string;
      name: string;
    } | null;
  }>;

  course_purchased?: Array<{
    id: string;
    course?: {
      id: string;
      title: string;
    };
  }>;
};

export type StudentPagination = {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type StudentFilters = {
  search: string;
  role: string;
  course: string;
  cohortSearch: string;
};

export type CourseOption = {
  id: string;
  title: string;
};

export type CohortOption = {
  id: string;
  name: string;
  courseId: string;
  startDate?: string | null;
  endDate?: string | null;
};
