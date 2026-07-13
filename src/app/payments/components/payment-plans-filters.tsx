import { Filter, Search } from "lucide-react";
import { PaymentPlansFiltersState } from "../hooks/use-payment-plans";

const collectionStatusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Outstanding", value: "PENDING" },
  { label: "Overdue Grace", value: "OVERDUE_GRACE" },
  { label: "Defaulted", value: "DEFAULTED" },
  { label: "Bad Debt", value: "BAD_DEBT" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Expired", value: "EXPIRED" },
];

type PaymentPlansFiltersProps = {
  filters: PaymentPlansFiltersState;
  onFilterChange: <K extends keyof PaymentPlansFiltersState>(
    key: K,
    value: PaymentPlansFiltersState[K],
  ) => void;
};

export function PaymentPlansFilters({
  filters,
  onFilterChange,
}: PaymentPlansFiltersProps) {
  return (
    <div className="bg-white p-3 md:p-4 rounded-3xl border border-slate-100 flex flex-col xl:flex-row items-center gap-3 md:gap-4">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />

        <input
          value={filters.query}
          onChange={(event) => onFilterChange("query", event.target.value)}
          placeholder="Search by user, email or course..."
          className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full xl:w-auto">
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />

          <select
            value={filters.collectionStatus}
            onChange={(event) =>
              onFilterChange("collectionStatus", event.target.value)
            }
            className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold appearance-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          >
            {collectionStatusOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <input
          type="date"
          value={filters.dateFrom}
          onChange={(event) => onFilterChange("dateFrom", event.target.value)}
          className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20"
        />

        <input
          type="date"
          value={filters.dateTo}
          onChange={(event) => onFilterChange("dateTo", event.target.value)}
          className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>
    </div>
  );
}
