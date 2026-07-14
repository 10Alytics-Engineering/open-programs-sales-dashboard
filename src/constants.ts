export const USER_ROLES = [
  { value: "USER", label: "User" },
  { value: "COURSE_ADMIN", label: "Course Admin" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "FINANCE_ADMIN", label: "Finance Admin" },
];

export const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: "₦",
  GHS: "₵",
  ZAR: "R",
  KES: "KSh",
  UGX: "USh",
  RWF: "FRw",
  USD: "$",
  GBP: "£",
};

export const PAYMENT_CURRENCIES = [
  "NGN",
  "USD",
  "GBP",
  "GHS",
  "RWF",
  "UGX",
] as const;

export const CURRENCY_GATEWAY_LABELS: Record<string, string> = {
  NGN: "Paystack",
  USD: "Stripe",
  GBP: "Stripe",
  GHS: "Start Button",
  RWF: "Start Button",
  UGX: "Start Button",
};

export const resolveGatewayLabel = (currency: string) => {
  return CURRENCY_GATEWAY_LABELS[currency] || "Paystack";
};
