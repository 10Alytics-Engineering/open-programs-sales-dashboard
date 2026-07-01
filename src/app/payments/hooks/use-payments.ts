"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import api from "@/lib/axios";
import { PaginationMeta, Transaction } from "@/types";

export type PaymentsFiltersState = {
  query: string;
  status: string;
  gateway: string;
  duration: string;
};

const initialPagination: PaginationMeta = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,
};

export function usePayments() {
  const searchParams = useSearchParams();

  const [payments, setPayments] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingExport, setLoadingExport] = useState(false);

  const [countBySource, setCountBySource] = useState({
    paystack: 0,
    stripe: 0,
    startButton: 0,
  });

  const [filters, setFilters] = useState<PaymentsFiltersState>({
    query: "",
    status: searchParams.get("status") || "success",
    duration: searchParams.get("duration") || "all",
    gateway: searchParams.get("gateway") || "all",
  });

  const [pagination, setPagination] =
    useState<PaginationMeta>(initialPagination);

  const setFilter = <K extends keyof PaymentsFiltersState>(
    key: K,
    value: PaymentsFiltersState[K],
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

  const fetchPayments = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      params.set("page", String(pagination.page));
      params.set("limit", String(pagination.limit));

      if (filters.query) params.set("query", filters.query);
      if (filters.status !== "all") params.set("status", filters.status);
      if (filters.gateway !== "all") params.set("gateway", filters.gateway);
      if (filters.duration !== "all") params.set("duration", filters.duration);

      const response = await api.get(
        `/sales-dashboard/transactions?${params.toString()}`,
      );

      setPayments(response.data.transactions || []);
      setCountBySource(
        response.data.countBySource || {
          paystack: 0,
          stripe: 0,
          startButton: 0,
        },
      );
      setPagination(response.data.pagination || initialPagination);
    } catch (error) {
      console.error("Failed to fetch payments", error);
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setLoadingExport(true);

    try {
      const response = await api.post("/sales-dashboard/export-to-sheets");

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Data successfully exported to Google Sheets",
        );

        if (response.data.sheetUrl) {
          window.open(response.data.sheetUrl, "_blank");
        }
      } else {
        toast.error(response.data.error || "Failed to export data");
      }
    } catch (error: any) {
      console.error("Export error", error);
      toast.error(
        error?.response?.data?.error ||
          "Failed to export data to Google Sheets",
      );
    } finally {
      setLoadingExport(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchPayments, 300);
    return () => clearTimeout(timer);
  }, [
    filters.query,
    filters.status,
    filters.gateway,
    filters.duration,
    pagination.page,
    pagination.limit,
  ]);

  return {
    payments,
    loading,
    loadingExport,
    filters,
    setFilter,
    countBySource,
    pagination,
    setPage,
    setLimit,
    handleExport,
  };
}
