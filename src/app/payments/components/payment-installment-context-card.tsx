import { CheckCircle2, Clock } from "lucide-react";

import { cn, formatDate, formatPrice } from "@/lib/utils";

type PaymentInstallmentContextCardProps = {
  installment: {
    amount: number;
    dueDate: string;
    paid: boolean;
    installmentNumber: number;
  };
};

export function PaymentInstallmentContextCard({
  installment,
}: PaymentInstallmentContextCardProps) {
  return (
    <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">
          Installment Context
        </p>

        <h3 className="text-lg font-black text-slate-900 mt-1">
          This transaction is linked to installment #
          {installment.installmentNumber}
        </h3>

        <p className="text-xs font-bold text-slate-500 mt-1">
          Due {formatDate(installment.dueDate)}
        </p>
      </div>

      <div className="text-left md:text-right">
        <p className="text-xl font-black text-slate-900">
          {formatPrice(installment.amount)}
        </p>

        <span
          className={cn(
            "inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase",
            installment.paid
              ? "bg-emerald-100 text-emerald-700"
              : "bg-white text-slate-500",
          )}
        >
          {installment.paid ? (
            <>
              <CheckCircle2 className="w-3 h-3" />
              Paid
            </>
          ) : (
            <>
              <Clock className="w-3 h-3" />
              Pending
            </>
          )}
        </span>
      </div>
    </div>
  );
}
