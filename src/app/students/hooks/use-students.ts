"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import api from "@/lib/axios";
import { StudentFilters, StudentPagination, StudentUser } from "../types";

const initialPagination: StudentPagination = {
  currentPage: 1,
  totalPages: 0,
  totalUsers: 0,
  limit: 20,
  hasNextPage: false,
  hasPreviousPage: false,
};

const initialFilters: StudentFilters = {
  search: "",
  role: "",
  course: "",
  cohortSearch: "",
};

export function useStudents() {
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(true);

  const [filters, setFilters] = useState<StudentFilters>(initialFilters);
  const [pagination, setPagination] =
    useState<StudentPagination>(initialPagination);

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchOptions = useCallback(async () => {
    try {
      setOptionsLoading(true);

      const [coursesResponse, cohortsResponse] = await Promise.all([
        api.get("/courses"),
        api.get("/cohorts"),
      ]);

      setCourses(coursesResponse.data?.data || []);
      setCohorts(cohortsResponse.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch students page options:", error);
      toast.error("Failed to load courses and cohorts");
      setCourses([]);
      setCohorts([]);
    } finally {
      setOptionsLoading(false);
    }
  }, []);

  const fetchStudents = useCallback(
    async (page = pagination.currentPage, customLimit?: number) => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          page: String(page),
          limit: String(customLimit || pagination.limit),
          sortBy,
          sortOrder,
        });

        if (filters.search) params.set("search", filters.search);
        if (filters.role) params.set("role", filters.role);
        if (filters.course) params.set("course", filters.course);
        if (filters.cohortSearch) {
          params.set("cohortSearch", filters.cohortSearch);
        }

        const response = await api.get(`/users?${params.toString()}`);

        setStudents(response.data?.data?.users || []);
        setPagination(response.data?.data?.pagination || initialPagination);
      } catch (error) {
        console.error("Failed to fetch students:", error);
        toast.error("Failed to load students");
        setStudents([]);
      } finally {
        setLoading(false);
      }
    },
    [
      filters.search,
      filters.role,
      filters.course,
      filters.cohortSearch,
      pagination.currentPage,
      pagination.limit,
      sortBy,
      sortOrder,
    ],
  );

  const setFilter = <K extends keyof StudentFilters>(
    key: K,
    value: StudentFilters[K],
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));

    setPagination((current) => ({
      ...current,
      currentPage: 1,
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setPagination((current) => ({
      ...current,
      currentPage: 1,
    }));
  };

  const setPage = (page: number) => {
    setPagination((current) => ({
      ...current,
      currentPage: page,
    }));

    fetchStudents(page);
  };

  const setLimit = (limit: number) => {
    setPagination((current) => ({
      ...current,
      currentPage: 1,
      limit,
    }));

    fetchStudents(1, limit);
  };

  const refreshData = () => {
    fetchStudents(pagination.currentPage);
  };

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [
    filters.search,
    filters.role,
    filters.course,
    filters.cohortSearch,
    sortBy,
    sortOrder,
  ]);

  return {
    students,
    courses,
    cohorts,

    loading,
    optionsLoading,

    filters,
    pagination,
    sortBy,
    sortOrder,

    setFilter,
    clearFilters,
    setPage,
    setLimit,
    setSortBy,
    setSortOrder,
    refreshData,
  };
}
