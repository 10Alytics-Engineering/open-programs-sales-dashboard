"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import api from "@/lib/axios";
import { Transaction } from "@/types";

export function usePaymentDetail() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const source = searchParams.get("source");

  const [payment, setPayment] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  const metadata = useMemo(() => {
    if (!payment?.metadata) return payment?.metadataParsed || {};

    try {
      return JSON.parse(payment.metadata);
    } catch {
      return payment.metadataParsed || {};
    }
  }, [payment]);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;

      setLoading(true);

      try {
        const url = source
          ? `/sales-dashboard/transactions/${id}?source=${source}`
          : `/sales-dashboard/transactions/${id}`;

        const response = await api.get(url);
        setPayment(response.data);
      } catch (error) {
        console.error("Failed to fetch payment details", error);
        toast.error("Failed to load payment details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, source]);

  return {
    payment,
    loading,
    metadata,
  };
}
