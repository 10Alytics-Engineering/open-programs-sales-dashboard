"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import api from "@/lib/axios";
import { PaymentPlanRecord } from "@/types";

export function usePaymentPlanDetail() {
  const { id } = useParams<{ id: string }>();

  const [plan, setPlan] = useState<PaymentPlanRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPlan = useCallback(async () => {
    if (!id) return;

    setLoading(true);

    try {
      const response = await api.get(`/sales-dashboard/payment-plans/${id}`);
      setPlan(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load payment plan");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  return {
    plan,
    loading,
    refetch: fetchPlan,
  };
}
