"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { PaymentPlanRecord } from "@/types";
import { usePaymentPlanActions } from "../hooks/use-payment-plan-actions";
import { PaymentInstallmentsTab } from "./payment-installments-tab";
import { PaymentTransactionsTab } from "./payment-transactions-tab";

type PaymentPlanTabsProps = {
  plan: PaymentPlanRecord;
  actions: ReturnType<typeof usePaymentPlanActions>;
};

type PaymentPlanTab = "installments" | "transactions";

const tabs: Array<{
  value: PaymentPlanTab;
  label: string;
}> = [
  {
    value: "installments",
    label: "Installments",
  },
  {
    value: "transactions",
    label: "Transactions",
  },
];

export function PaymentPlanTabs({ plan, actions }: PaymentPlanTabsProps) {
  const [activeTab, setActiveTab] = useState<PaymentPlanTab>("installments");

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex border-b border-slate-100 p-2 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "px-4 py-3 rounded-2xl text-sm font-black transition",
              activeTab === tab.value
                ? "bg-indigo-600 text-white"
                : "text-slate-500 hover:bg-slate-50",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-5 md:p-8">
        {activeTab === "installments" ? (
          <PaymentInstallmentsTab
            installments={plan.paymentInstallments || []}
            actions={actions}
          />
        ) : (
          <PaymentTransactionsTab
            plan={plan}
            transactions={plan.transactions || []}
            actions={actions}
          />
        )}
      </div>
    </div>
  );
}
