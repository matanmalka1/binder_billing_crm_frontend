import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParamFilters } from "../../../hooks/useSearchParamFilters";
import { useRole } from "../../../hooks/useRole";
import { useForm } from "react-hook-form";
import { taxDeadlinesApi, taxDeadlinesQK } from "../api";
import type { TaxDeadlineResponse } from "../api";
import { timelineQK } from "@/features/timeline/api";
import { parsePositiveInt, showErrorToast } from "../../../utils/utils";
import { toOptionalString } from "../../../utils/filters";
import type { TaxDeadlineFilters, CreateTaxDeadlineForm, EditTaxDeadlineForm } from "../types";
import { toast } from "../../../utils/toast";
import { getErrorMessage } from "../../../utils/utils";

export const useTaxDeadlines = () => {
  const queryClient = useQueryClient();
  const { isAdvisor } = useRole();
  const { searchParams, setFilter } = useSearchParamFilters();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [editingDeadline, setEditingDeadline] = useState<TaxDeadlineResponse | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filters: TaxDeadlineFilters = useMemo(
    () => ({
      client_name: searchParams.get("client_name") || "",
      deadline_type: searchParams.get("deadline_type") || "",
      status: searchParams.get("status") || "",
      page: parsePositiveInt(searchParams.get("page"), 1),
      page_size: parsePositiveInt(searchParams.get("page_size"), 20),
    }),
    [searchParams],
  );

  const apiParams = useMemo(
    () => ({
      client_name: toOptionalString(filters.client_name),
      deadline_type: toOptionalString(filters.deadline_type),
      status: toOptionalString(filters.status),
      page: filters.page,
      page_size: filters.page_size,
    }),
    [filters],
  );

  const deadlinesQuery = useQuery({
    queryKey: taxDeadlinesQK.list(apiParams),
    queryFn: () => taxDeadlinesApi.listTaxDeadlines(apiParams),
  });

  const createMutation = useMutation({
    mutationFn: (payload: {
      business_id: number;
      deadline_type: string;
      due_date: string;
      payment_amount?: string | null;
      description?: string | null;
    }) => taxDeadlinesApi.createTaxDeadline(payload),
    onSuccess: (_data, payload) => {
      toast.success("מועד נוצר בהצלחה");
      queryClient.invalidateQueries({ queryKey: taxDeadlinesQK.all });
      queryClient.invalidateQueries({ queryKey: timelineQK.businessRoot(payload.business_id) });
      setShowCreateModal(false);
    },
    onError: (error) => showErrorToast(error, "שגיאה ביצירת מועד"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: {
      id: number;
      payload: { deadline_type?: string; due_date?: string; payment_amount?: string | null; description?: string | null };
    }) => taxDeadlinesApi.updateTaxDeadline(id, payload),
    onSuccess: () => {
      toast.success("מועד עודכן בהצלחה");
      queryClient.invalidateQueries({ queryKey: taxDeadlinesQK.all });
      setEditingDeadline(null);
    },
    onError: (error) => showErrorToast(error, "שגיאה בעדכון מועד"),
  });

  const deleteMutation = useMutation({
    mutationFn: (deadlineId: number) => taxDeadlinesApi.deleteTaxDeadline(deadlineId),
    onSuccess: () => {
      toast.success("מועד נמחק בהצלחה");
      queryClient.invalidateQueries({ queryKey: taxDeadlinesQK.all });
    },
    onError: (error) => showErrorToast(error, "שגיאה במחיקת מועד"),
    onSettled: () => setDeletingId(null),
  });

  const generateMutation = useMutation({
    mutationFn: (payload: { business_id: number; year: number }) =>
      taxDeadlinesApi.generateDeadlines(payload),
    onSuccess: (data, payload) => {
      toast.success(`נוצרו ${data.created_count} דדליינים בהצלחה`);
      queryClient.invalidateQueries({ queryKey: taxDeadlinesQK.all });
      queryClient.invalidateQueries({ queryKey: timelineQK.businessRoot(payload.business_id) });
    },
    onError: (error) => showErrorToast(error, "שגיאה ביצירת דדליינים"),
  });

  const completeMutation = useMutation({
    mutationFn: (deadlineId: number) => taxDeadlinesApi.completeTaxDeadline(deadlineId),
    onSuccess: () => {
      toast.success("מועד סומן כהושלם");
      queryClient.invalidateQueries({ queryKey: taxDeadlinesQK.all });
    },
    onError: (error) => showErrorToast(error, "שגיאה בסימון מועד"),
    onSettled: () => setCompletingId(null),
  });

  const editForm = useForm<EditTaxDeadlineForm>({
    defaultValues: { deadline_type: "", due_date: "", payment_amount: "", description: "" },
  });

  const form = useForm<CreateTaxDeadlineForm>({
    defaultValues: {
      business_id: "",
      deadline_type: "vat",
      due_date: "",
      payment_amount: "",
      description: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await createMutation.mutateAsync({
      business_id: Number(values.business_id),
      deadline_type: values.deadline_type,
      due_date: values.due_date,
      payment_amount: values.payment_amount ? values.payment_amount : null,
      description: values.description || null,
    });
    form.reset();
  });

  const onEditSubmit = editForm.handleSubmit(async (values) => {
    if (!editingDeadline) return;
    await updateMutation.mutateAsync({
      id: editingDeadline.id,
      payload: {
        deadline_type: values.deadline_type || undefined,
        due_date: values.due_date || undefined,
        payment_amount: values.payment_amount ? values.payment_amount : null,
        description: values.description || null,
      },
    });
    editForm.reset();
  });

  const handleFilterChange = (key: string, value: string) => setFilter(key, value);

  const handleComplete = async (deadlineId: number) => {
    setCompletingId(deadlineId);
    await completeMutation.mutateAsync(deadlineId);
  };

  const handleEdit = (deadline: TaxDeadlineResponse) => {
    setEditingDeadline(deadline);
    editForm.reset({
      deadline_type: deadline.deadline_type,
      due_date: deadline.due_date,
      payment_amount: deadline.payment_amount != null ? String(deadline.payment_amount) : "",
      description: deadline.description ?? "",
    });
  };

  const handleDelete = (deadlineId: number) => {
    setDeletingId(deadlineId);
    deleteMutation.mutate(deadlineId);
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
    isUpdating: updateMutation.isPending,
    completingId,
    deletingId,
    showCreateModal,
    editingDeadline,
    // Actions
    setShowCreateModal,
    setEditingDeadline,
    handleFilterChange,
    handleComplete,
    handleEdit,
    handleDelete,
    // Generate
    handleGenerate: (businessId: number, year: number) =>
      generateMutation.mutate({ business_id: businessId, year }),
    isGenerating: generateMutation.isPending,
    // Forms
    form,
    onSubmit,
    editForm,
    onEditSubmit,

    // Permissions
    isAdvisor,
  };
};
