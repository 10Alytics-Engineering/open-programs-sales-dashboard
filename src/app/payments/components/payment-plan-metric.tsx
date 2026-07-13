type PaymentPlanMetricProps = {
  label: string;
  value: string;
};

export function PaymentPlanMetric({ label, value }: PaymentPlanMetricProps) {
  return (
    <div className="bg-slate-50 rounded-2xl p-4">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </p>

      <p className="text-sm md:text-base font-black text-slate-900 mt-2">
        {value}
      </p>
    </div>
  );
}
