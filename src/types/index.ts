interface PurchaseType {
  course: any;
  id: string;
  userId: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

export type CohortType = {
  id: string;
  name: string;
  startDate?: Date;
  endDate?: Date | null;
  courseId?: string;
  course: CourseType;
  users: UserCohortType[];
  cohortCourses: CohortCourse[];
  createdAt?: string;
  updatedAt?: string;
};

export type UserCohortType = {
  id: string;
  courseId?: string;
  cohortId: string;
  cohort: CohortType;
  userId?: string;
  user: User;
  isPaymentActive: boolean;
  isActive: boolean;
  archivedAt?: Date;
  previousEnrollmentId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CohortCourseWeek = {
  id: string;
  title?: string;
  iconUrl?: string;
  cohortCourseId?: string;
  isPublished?: boolean;
};

export type CohortCourseTimetable = {
  id?: string;
  name?: string;
  category?:
    | "LESSON"
    | "QUIZ"
    | "ASSESSMENT"
    | "PROJECT"
    | "LIVE_CLASS"
    | "BREAK";
  date?: Date;
  cohortCourseId?: string;
};

interface PurchaseType {
  course: any;
  id: string;
  userId: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cohort {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
}

export type CourseType = {
  id: string;
  title: string;
  description?: string;
  price?: string;
  discount?: string;
  imageUrl?: string;
  course_duration?: string;
  course_instructor_name?: string;
  course_instructor_image?: string;
  course_instructor_title?: string;
  course_instructor_description?: string;
  course_instructor_ratings?: string;
  course_instructor_courses?: string;
  course_instructor_lessons?: string;
  course_instructor_hrs?: string;
  course_instructor_students_trained?: string;
  hasFreeModules: boolean;

  brochureUrl?: string;
  course_preview_video?: string;
  course_weeks: CourseWeekType[];
  course_videos: string[]; // Ids of ProjectVideo
  pricingPlans: CoursePricingPlanType[];
  // purchases: string[]; // Ids of Purchase
  timetable: TimeTable[];
  syllabus?: string;
  isPublished: boolean;
  publishStatus: "DRAFT" | "PUBLISHED";
  cohorts: { id: string }[];
  createdAt: string;
  updatedAt: string;
};

export type TimeTable = {
  id?: string;
  name?: string;
  category?:
    | "LESSON"
    | "QUIZ"
    | "ASSESSMENT"
    | "PROJECT"
    | "LIVE_CLASS"
    | "BREAK";
  date?: Date;
  courseId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CoursePricingPlanType = {
  id: string;
  courseId: string;
  planType: string;
  amountPerInstallment: number;
  installmentsCount: number;
  discountPrice?: number;
  createdAt: string;
  updatedAt: string;
};

export type CourseWeekType = {
  id: string;
  title: string;
  iconUrl?: string;
  courseId: string;
  course: CourseType;
  attachments: AttachmentType[];
  courseModules: ModuleType[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AttachmentType = {
  id: string;
  name: string;
  url?: string;
  courseWeekId: string;
  courseWeek: CourseWeekType;
  createdAt: string;
  updatedAt: string;
};

export type ModuleType = {
  id: string;
  title: string;
  description?: string;
  iconUrl?: string;
  isFree?: boolean;
  CourseWeek?: CourseWeekType | null;
  courseWeekId?: string;
  projectVideos?: ProjectVideoType[];
  quizzes?: QuizType[];
  createdAt?: string;
  updatedAt?: string;
};

export type QuizType = {
  id: string;
  question?: string;
  answers?: QuizAnswerType[];
  moduleId?: string;
  courseModule?: ModuleType;
  createdAt?: string;
  updatedAt?: string;
};

export type QuizAnswerType = {
  id?: string;
  name?: string;
  quizId?: string;
  quiz?: QuizType;
  isCorrect?: boolean;
};

export type ProjectVideoType = {
  id: string;
  title?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  thumbnailKey?: string;
  duration?: string;
  videoType?: string; // VIMEO | YOUTUBE | UPLOAD | EXTERNAL
  moduleId?: string;
  courseModule?: ModuleType;
  courseId?: string;
  course?: CourseType;
  createdAt?: string;
  updatedAt?: string;
};

export type CohortCourse = {
  id: string;
  cohortId?: string;
  cohort?: CohortType;
  courseId?: string;
  course?: CourseType;
  title?: string;
  description?: string | null;
  price?: string | null;
  imageUrl?: string | null;
  course_duration?: string | null;
  course_instructor_name?: string | null;
  course_instructor_image?: string | null;
  course_instructor_title?: string | null;
  course_instructor_description?: string | null;
  brochureUrl?: string | null;
  course_preview_video?: string | null;
  cohortTimeTable?: CohortCourseTimetable[];
  cohortWeeks?: CohortCourseWeek[];
  createdAt?: string;
  updatedAt?: string;
};

export interface User {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  role: string;
  createdAt: string;
  paymentStatus?: PaymentStatus[];
  videosCompleted: number;
  totalVideos: number;

  emailVerified: string;
  image?: string | null;
  password?: string | null;
  access_token?: string | null;
  ongoing_courses?: string[];
  completed_courses?: string[];
  course_purchased: PurchaseType[];
  cohorts: UserCohortType[];
  expectedVideoProgress: number;
  inactive?: boolean;
  updatedAt?: string;
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
