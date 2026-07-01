"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import api from "@/lib/axios";
import { PaginationMeta, PaymentPlanRecord } from "@/types";

export type PaymentPlansFiltersState = {
  query: string;
  status: string;
  dateFrom: string;
  dateTo: string;
};

export type PaymentPlansSummary = {
  expected: number;
  collected: number;
  outstanding: number;
  overdue: number;
};

const initialFilters: PaymentPlansFiltersState = {
  query: "",
  status: "all",
  dateFrom: "",
  dateTo: "",
};

const initialPagination: PaginationMeta = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,
};

export function usePaymentPlans() {
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] =
    useState<PaymentPlansFiltersState>(initialFilters);

  const [pagination, setPagination] =
    useState<PaginationMeta>(initialPagination);

  const setFilter = <K extends keyof PaymentPlansFiltersState>(
    key: K,
    value: PaymentPlansFiltersState[K],
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));

    setPagination((current) => ({
      ...current,
      page: 1,
    }));
  };

  const setPage = (page: number) => {
    setPagination((current) => ({
      ...current,
      page,
    }));
  };

  const setLimit = (limit: number) => {
    setPagination((current) => ({
      ...current,
      page: 1,
      limit,
    }));
  };

  const fetchPlans = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      params.set("page", String(pagination.page));
      params.set("limit", String(pagination.limit));

      if (filters.query) params.set("query", filters.query);
      if (filters.status !== "all") params.set("status", filters.status);
      if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.set("dateTo", filters.dateTo);

      const response = await api.get(
        `/sales-dashboard/payment-plans?${params.toString()}`,
      );

      setPaymentPlans(response.data.paymentPlans || []);
      setPagination(response.data.pagination || initialPagination);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load payment plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchPlans, 300);
    return () => clearTimeout(timer);
  }, [
    filters.query,
    filters.status,
    filters.dateFrom,
    filters.dateTo,
    pagination.page,
    pagination.limit,
  ]);

  const summary = useMemo<PaymentPlansSummary>(() => {
    return paymentPlans.reduce(
      (acc, plan) => {
        acc.expected += plan.totals?.expectedAmount || 0;
        acc.collected += plan.totals?.paidAmount || 0;
        acc.outstanding += plan.totals?.pendingAmount || 0;
        acc.overdue += plan.totals?.overdueAmount || 0;
        return acc;
      },
      {
        expected: 0,
        collected: 0,
        outstanding: 0,
        overdue: 0,
      },
    );
  }, [paymentPlans]);

  return {
    paymentPlans,
    loading,
    filters,
    setFilter,
    summary,
    pagination,
    setPage,
    setLimit,
    refetch: fetchPlans,
  };
}
