"use client";

import { Clock, CreditCard, Filter, Search } from "lucide-react";
import { PaymentsFiltersState } from "../hooks/use-payments";

type PaymentsFiltersProps = {
  filters: PaymentsFiltersState;
  onFilterChange: <K extends keyof PaymentsFiltersState>(
    key: K,
    value: PaymentsFiltersState[K],
  ) => void;
};

export function PaymentsFilters({
  filters,
  onFilterChange,
}: PaymentsFiltersProps) {
  return (
    <div className="bg-white p-3 md:p-4 rounded-3xl border border-slate-100 flex flex-col xl:flex-row items-center gap-3 md:gap-4">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />

        <input
          type="text"
          placeholder="Search by name, email, phone, course or reference..."
          className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
          value={filters.query}
          onChange={(event) => onFilterChange("query", event.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 w-full xl:w-auto">
        <div className="relative">
          <Filter className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />

          <select
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-8 md:pl-10 pr-8 md:pr-10 text-[11px] md:text-sm font-bold appearance-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            value={filters.status}
            onChange={(event) => onFilterChange("status", event.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="success">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <div className="relative">
          <CreditCard className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />

          <select
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-8 md:pl-10 pr-8 md:pr-10 text-[11px] md:text-sm font-bold appearance-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            value={filters.gateway}
            onChange={(event) => onFilterChange("gateway", event.target.value)}
          >
            <option value="all">All Gateways</option>
            <option value="PAYSTACK">Paystack</option>
            <option value="START_BUTTON">Start Button</option>
            <option value="STRIPE">Stripe</option>
          </select>
        </div>

        <div className="relative">
          <Clock className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />

          <select
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-8 md:pl-10 pr-8 md:pr-10 text-[11px] md:text-sm font-bold appearance-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            value={filters.duration}
            onChange={(event) => onFilterChange("duration", event.target.value)}
          >
            <option value="7d">Last 7D</option>
            <option value="30d">Last 30D</option>
            <option value="90d">Last 90D</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>
    </div>
  );
}
