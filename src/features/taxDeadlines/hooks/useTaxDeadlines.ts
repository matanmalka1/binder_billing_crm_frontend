import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParamFilters } from "../../../hooks/useSearchParamFilters";
import { useForm } from "react-hook-form";
import { taxDeadlinesApi } from "../../../api/taxDeadlines.api";
import { parsePositiveInt, showErrorToast } from "../../../utils/utils";
import { toOptionalNumber, toOptionalString } from "../../../utils/filters";
import type { TaxDeadlineFilters, CreateTaxDeadlineForm } from "../types";
import { QK } from "../../../lib/queryKeys";
import { toast } from "../../../utils/toast";
import { getErrorMessage } from "../../../utils/utils";

export const useTaxDeadlines = () => {
  const queryClient = useQueryClient();
  const { searchParams, setFilter } = useSearchParamFilters();
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
    [searchParams],
  );

  const apiParams = useMemo(
    () => ({
      client_id: toOptionalNumber(filters.client_id),
      deadline_type: toOptionalString(filters.deadline_type),
      status: toOptionalString(filters.status),
      page: filters.page,
      page_size: filters.page_size,
    }),
    [filters],
  );

  const deadlinesQuery = useQuery({
    queryKey: QK.tax.deadlines.list(apiParams),
    queryFn: () => taxDeadlinesApi.listTaxDeadlines(apiParams),
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
      queryClient.invalidateQueries({ queryKey: QK.tax.deadlines.all });
      setShowCreateModal(false);
    },
    onError: (error) => showErrorToast(error, "שגיאה ביצירת מועד"),
  });

  const completeMutation = useMutation({
    mutationFn: (deadlineId: number) => taxDeadlinesApi.completeTaxDeadline(deadlineId),
    onSuccess: () => {
      toast.success("מועד סומן כהושלם");
      queryClient.invalidateQueries({ queryKey: QK.tax.deadlines.all });
    },
    onError: (error) => showErrorToast(error, "שגיאה בסימון מועד"),
    onSettled: () => setCompletingId(null),
  });

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

  const handleFilterChange = (key: string, value: string) => setFilter(key, value);

  const handleComplete = async (deadlineId: number) => {
    setCompletingId(deadlineId);
    await completeMutation.mutateAsync(deadlineId);
  };

  const deadlines = deadlinesQuery.data?.items ?? [];
  const total = deadlinesQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / filters.page_size));

  return {
    // Data
    deadlines,
    total,
    totalPages,
    filters,
    // State
    isLoading: deadlinesQuery.isPending,
    error: deadlinesQuery.error
      ? getErrorMessage(deadlinesQuery.error, "שגיאה בטעינת מועדים")
      : null,
    isCreating: createMutation.isPending,
    completingId,
    showCreateModal,
    // Actions
    setShowCreateModal,
    handleFilterChange,
    handleComplete,
    // Form
    form,
    onSubmit,
  };
};