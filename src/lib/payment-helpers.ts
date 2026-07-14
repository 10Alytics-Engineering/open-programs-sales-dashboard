import { CURRENCY_SYMBOLS } from "@/constants";

export function formatMoneyAmount(amount: any, currency = "NGN") {
  const symbol = CURRENCY_SYMBOLS[currency] || `${currency} `;
  const value = Number(amount || 0);

  return `${symbol}${value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;
}

export function formatTransactionAmount(payment: any) {
  if (payment.displayAmountFormatted) return payment.displayAmountFormatted;

  const currency =
    payment.displayCurrency ||
    payment.providerCurrency ||
    payment.currency ||
    "NGN";

  const amount =
    payment.displayAmount ?? payment.providerAmount ?? payment.amount ?? 0;

  return formatMoneyAmount(amount, currency);
}

export function formatPaymentPlanAmount(plan: any, key: string) {
  const formattedKey = `${key}Formatted`;

  if (plan.totals?.[formattedKey]) {
    return plan.totals[formattedKey];
  }

  return formatMoneyAmount(
    plan.totals?.[key] || 0,
    plan.totals?.displayCurrency || plan.displayCurrency || "NGN",
  );
}
