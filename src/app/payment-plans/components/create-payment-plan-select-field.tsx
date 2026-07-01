import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type SelectOption = {
  value: string;
  label: string;
};

type CreatePaymentPlanSelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: SelectOption[];
  disabled?: boolean;
};

export function CreatePaymentPlanSelectField({
  label,
  value,
  onChange,
  placeholder,
  options,
  disabled,
}: CreatePaymentPlanSelectFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-black uppercase tracking-widest text-slate-400">
        {label}
      </span>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className={cn(
            "w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm font-bold text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50",
            disabled && "opacity-60 cursor-not-allowed",
          )}
        >
          <option value="">{placeholder}</option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-400" />
      </div>
    </label>
  );
}
