"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import api from "@/lib/axios";
import { User as UserType, Transaction } from "@/types";

export function useStudentProfile(studentId: string) {
  const [student, setStudent] = useState<UserType | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudentData = useCallback(async () => {
    try {
      setLoading(true);

      const [
        userResponse,
        coursesResponse,
        cohortsResponse,
        transactionsResponse,
      ] = await Promise.allSettled([
        api.get(`/users/${studentId}`),
        api.get("/courses"),
        api.get("/cohorts"),
        api.get(`/users/${studentId}/transactions`),
      ]);

      if (userResponse.status === "fulfilled") {
        setStudent(userResponse.value.data?.data ?? null);
      }

      if (coursesResponse.status === "fulfilled") {
        setCourses(coursesResponse.value.data?.data ?? []);
      }

      if (cohortsResponse.status === "fulfilled") {
        setCohorts(cohortsResponse.value.data?.data ?? []);
      }

      if (transactionsResponse.status === "fulfilled") {
        setTransactions(transactionsResponse.value.data?.transactions ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch student data", error);
      toast.error("Failed to load student details");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const lifetimeValue = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.status === "success")
      .reduce(
        (total, transaction) => total + Number(transaction.amount || 0),
        0,
      );
  }, [transactions]);

  return {
    student,
    courses,
    cohorts,
    transactions,
    lifetimeValue,
    loading,
    refresh: fetchStudentData,
  };
}
