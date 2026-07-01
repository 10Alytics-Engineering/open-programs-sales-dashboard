import { ReactNode } from "react";

type CreatePaymentPlanSectionCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
};

export function CreatePaymentPlanSectionCard({
  icon,
  title,
  description,
  children,
}: CreatePaymentPlanSectionCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 md:p-6 space-y-5">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          {icon}
        </div>

        <div>
          <h2 className="text-base font-black text-slate-900">{title}</h2>

          <p className="text-xs md:text-sm font-medium text-slate-500 mt-1">
            {description}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}
