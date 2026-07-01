type CreatePaymentPlanMiniMetricProps = {
  label: string;
  value: string;
};

export function CreatePaymentPlanMiniMetric({
  label,
  value,
}: CreatePaymentPlanMiniMetricProps) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>

      <p className="text-sm font-black text-slate-900 mt-2">{value}</p>
    </div>
  );
}
