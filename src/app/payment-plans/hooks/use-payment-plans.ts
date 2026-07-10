"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import api from "@/lib/axios";
import {
  PaginationMeta,
  PaymentPlanRecord,
  PaymentPlansSummary,
} from "@/types";

export type PaymentPlansFiltersState = {
  query: string;
  collectionStatus: string;
  dateFrom: string;
  dateTo: string;
};

const initialFilters: PaymentPlansFiltersState = {
  query: "",
  collectionStatus: "all",
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

const initialSummary: PaymentPlansSummary = {
  expected: 0,
  collected: 0,
  outstanding: 0,
  overdue: 0,
  pending: { count: 0, amount: 0 },
  overdueGrace: { count: 0, amount: 0 },
  defaulted: { count: 0, amount: 0 },
  badDebt: { count: 0, amount: 0 },
  completed: { count: 0, amount: 0 },
  expired: { count: 0, amount: 0 },
};

export function usePaymentPlans() {
  const [loading, setLoading] = useState(true);
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlanRecord[]>([]);
  const [summary, setSummary] = useState<PaymentPlansSummary>(initialSummary);

  const [filters, setFilters] =
    useState<PaymentPlansFiltersState>(initialFilters);

  const [pagination, setPagination] =
    useState<PaginationMeta>(initialPagination);

  const [exporting, setExporting] = useState(false);

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
      if (filters.collectionStatus !== "all")
        params.set("collectionStatus", filters.collectionStatus);
      if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.set("dateTo", filters.dateTo);

      const response = await api.get(
        `/sales-dashboard/payment-plans?${params.toString()}`,
      );

      setPaymentPlans(response.data.paymentPlans || []);
      setPagination(response.data.pagination || initialPagination);
      setSummary(response.data.summary || initialSummary);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load payment plans");
    } finally {
      setLoading(false);
    }
  };

  const exportPlans = async () => {
    try {
      setExporting(true);

      const params = new URLSearchParams();

      if (filters.query) {
        params.set("query", filters.query);
      }

      if (filters.collectionStatus && filters.collectionStatus !== "all") {
        params.set("collectionStatus", filters.collectionStatus);
      }

      if (filters.dateFrom) {
        params.set("dateFrom", filters.dateFrom);
      }

      if (filters.dateTo) {
        params.set("dateTo", filters.dateTo);
      }

      /**
       * Add these only if your hook still supports them.
       */
      if ("userId" in filters && filters.userId) {
        params.set("userId", String(filters.userId));
      }

      if ("courseId" in filters && filters.courseId) {
        params.set("courseId", String(filters.courseId));
      }

      const response = await api.get(
        `/sales-dashboard/payment-plans/export?${params.toString()}`,
        {
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const contentDisposition = response.headers["content-disposition"];

      const filenameMatch = contentDisposition?.match(/filename="?([^"]+)"?/);

      const filename =
        filenameMatch?.[1] ||
        `payment-plans-export-${new Date().toISOString().slice(0, 10)}.xlsx`;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success("Payment plans exported successfully");
    } catch (error) {
      console.error("Failed to export payment plans:", error);
      toast.error("Failed to export payment plans");
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchPlans, 300);
    return () => clearTimeout(timer);
  }, [
    filters.query,
    filters.collectionStatus,
    filters.dateFrom,
    filters.dateTo,
    pagination.page,
    pagination.limit,
  ]);

  return {
    paymentPlans,
    loading,
    exporting,
    filters,
    setFilter,
    summary,
    pagination,
    setPage,
    setLimit,
    refetch: fetchPlans,
    exportPlans,
  };
}
