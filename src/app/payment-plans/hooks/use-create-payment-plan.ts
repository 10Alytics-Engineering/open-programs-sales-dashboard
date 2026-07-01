"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import api from "@/lib/axios";
import {
  CourseOption,
  CreatePaymentPlanFormState,
  PaymentPlanPreviewData,
  UserOption,
} from "../new/types";

const initialForm: CreatePaymentPlanFormState = {
  userId: "",
  courseId: "",
  cohortId: "",
  planType: "",
  notes: "",
};

export function useCreatePaymentPlan() {
  const router = useRouter();

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  const [users, setUsers] = useState<UserOption[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);

  const [form, setForm] = useState<CreatePaymentPlanFormState>(initialForm);
  const [preview, setPreview] = useState<PaymentPlanPreviewData | null>(null);

  const selectedUser = useMemo(() => {
    return users.find((user) => user.id === form.userId) || null;
  }, [users, form.userId]);

  const selectedCourse = useMemo(() => {
    return courses.find((course) => course.id === form.courseId) || null;
  }, [courses, form.courseId]);

  const selectedCohort = useMemo(() => {
    return (
      selectedCourse?.cohorts.find((cohort) => cohort.id === form.cohortId) ||
      null
    );
  }, [selectedCourse, form.cohortId]);

  const selectedPricingPlan = useMemo(() => {
    return (
      selectedCourse?.pricingPlans.find(
        (plan) => plan.planType === form.planType,
      ) || null
    );
  }, [selectedCourse, form.planType]);

  const canSubmit =
    Boolean(form.userId) &&
    Boolean(form.courseId) &&
    Boolean(form.planType) &&
    !submitting;

  const setField = <K extends keyof CreatePaymentPlanFormState>(
    key: K,
    value: CreatePaymentPlanFormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await api.get(
          "/sales-dashboard/payment-plans/create-options",
        );

        setUsers(response.data.users || []);
        setCourses(response.data.courses || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load form options");
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      cohortId: "",
      planType: "",
    }));
    setPreview(null);
  }, [form.courseId]);

  useEffect(() => {
    setPreview(null);

    if (!form.courseId || !form.planType) return;

    const fetchPreview = async () => {
      setPreviewLoading(true);

      try {
        const params = new URLSearchParams({
          courseId: form.courseId,
          planType: form.planType,
        });

        if (form.cohortId) {
          params.set("cohortId", form.cohortId);
        }

        const response = await api.get(
          `/sales-dashboard/payment-plans/preview?${params.toString()}`,
        );

        setPreview(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to preview payment plan");
      } finally {
        setPreviewLoading(false);
      }
    };

    fetchPreview();
  }, [form.courseId, form.cohortId, form.planType]);

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error("Please select a user, course and pricing plan");
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post("/sales-dashboard/payment-plans", {
        userId: form.userId,
        courseId: form.courseId,
        cohortId: form.cohortId || null,
        planType: form.planType,
        notes: form.notes,
      });

      toast.success("Payment plan created successfully");
      router.push(`/payment-plans/${response.data.id}`);
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.error || "Failed to create payment plan";

      toast.error(message);

      if (error?.response?.data?.paymentStatusId) {
        router.push(`/payment-plans/${error.response.data.paymentStatusId}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    users,
    courses,
    form,
    preview,

    loadingOptions,
    previewLoading,
    submitting,
    canSubmit,

    selectedUser,
    selectedCourse,
    selectedCohort,
    selectedPricingPlan,

    setField,
    handleBack,
    handleSubmit,
  };
}

export type CreatePaymentPlanWorkflow = ReturnType<typeof useCreatePaymentPlan>;
