import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { taxDeadlinesApi } from "../../../api/taxDeadlines.api";
import { getErrorMessage, parsePositiveInt } from "../../../utils/utils";
import { toast } from "../../../utils/toast";
import type { TaxDeadlineFilters, CreateTaxDeadlineForm } from "../types";

export const useTaxDeadlines = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [completingId, setCompletingId] = useState<number | null>(null);

  const filters: TaxDeadlineFilters = useMemo(
    () => ({
      client_id: searchParams.get("client_id") || "",
      deadline_type: searchParams.get("deadline_type") || "",
      status: searchParams.get("status") || "",
      page: parsePositiveInt(searchParams.get("page"), 1),
      page_size: parsePositiveInt(searchParams.get("page_size"), 20),
    }),
    [searchParams]
  );

  const deadlinesQuery = useQuery({
    queryKey: ["tax", "deadlines", "list", filters],
    queryFn: () =>
      taxDeadlinesApi.listTaxDeadlines({
        client_id: filters.client_id ? Number(filters.client_id) : undefined,
        deadline_type: filters.deadline_type || undefined,
        status: filters.status || undefined,
        page: filters.page,
        page_size: filters.page_size,
      }),
  });

  const createMutation = useMutation({
    mutationFn: (payload: {
      client_id: number;
      deadline_type: string;
      due_date: string;
      payment_amount?: number | null;
      description?: string | null;
    }) => taxDeadlinesApi.createTaxDeadline(payload),
    onSuccess: () => {
      toast.success("מועד נוצר בהצלחה");
      queryClient.invalidateQueries({ queryKey: ["tax", "deadlines"] });
      setShowCreateModal(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "שגיאה ביצירת מועד"));
    },
  });

  const completeMutation = useMutation({
    mutationFn: (deadlineId: number) => taxDeadlinesApi.completeTaxDeadline(deadlineId),
    onSuccess: () => {
      toast.success("מועד סומן כהושלם");
      queryClient.invalidateQueries({ queryKey: ["tax", "deadlines"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "שגיאה בסימון מועד"));
    },
    onSettled: () => {
      setCompletingId(null);
    },
  });

  const handleFilterChange = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    setSearchParams(next);
  };

  const handleComplete = async (deadlineId: number) => {
    setCompletingId(deadlineId);
    await completeMutation.mutateAsync(deadlineId);
  };

  const form = useForm<CreateTaxDeadlineForm>({
    defaultValues: {
      client_id: "",
      deadline_type: "vat",
      due_date: "",
      payment_amount: "",
      description: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await createMutation.mutateAsync({
      client_id: Number(values.client_id),
      deadline_type: values.deadline_type,
      due_date: values.due_date,
      payment_amount: values.payment_amount ? Number(values.payment_amount) : null,
      description: values.description || null,
    });
    form.reset();
  });

  const deadlines = deadlinesQuery.data?.items ?? [];
  const total = deadlinesQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / filters.page_size));

  return {
    filters,
    deadlinesQuery,
    createMutation,
    completeMutation,
    handleFilterChange,
    handleComplete,
    showCreateModal,
    setShowCreateModal,
    completingId,
    setCompletingId,
    form,
    onSubmit,
    deadlines,
    total,
    totalPages,
  };
};
