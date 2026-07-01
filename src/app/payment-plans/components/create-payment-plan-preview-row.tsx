type CreatePaymentPlanPreviewRowProps = {
  label: string;
  value: string;
};

export function CreatePaymentPlanPreviewRow({
  label,
  value,
}: CreatePaymentPlanPreviewRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>

      <p className="text-xs font-black text-right max-w-48">{value}</p>
    </div>
  );
}
