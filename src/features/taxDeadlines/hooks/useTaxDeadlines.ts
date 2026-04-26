import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParamFilters } from "../../../hooks/useSearchParamFilters";
import { useRole } from "../../../hooks/useRole";
import { useForm } from "react-hook-form";
import { taxDeadlinesApi, taxDeadlinesQK } from "../api";
import { timelineQK } from "@/features/timeline";
import { getHttpStatus, parsePositiveInt, showErrorToast } from "../../../utils/utils";
import { toOptionalString } from "../../../utils/filters";
import type {
  TaxDeadlineFilters,
  CreateTaxDeadlineForm,
  GenerateTaxDeadlinesForm,
} from "../types";
import { toast } from "../../../utils/toast";
import { getErrorMessage } from "../../../utils/utils";
import {
  DUPLICATE_TAX_DEADLINE_MESSAGE,
  toDeadlinePayloadPeriod,
  toDeadlinePayloadTaxYear,
  useTaxDeadlineActions,
} from "./useTaxDeadlineActions";

export const useTaxDeadlines = () => {
  const queryClient = useQueryClient();

  const invalidateAfterMutation = () => {
    queryClient.invalidateQueries({ queryKey: taxDeadlinesQK.all });
    queryClient.invalidateQueries({ queryKey: timelineQK.all });
  };
  const { isAdvisor } = useRole();
  const { searchParams, setFilter } = useSearchParamFilters();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const deadlineActions = useTaxDeadlineActions({ invalidateAfterMutation });

  const filters: TaxDeadlineFilters = useMemo(
    () => ({
      client_name: searchParams.get("client_name") || searchParams.get("business_name") || "",
      deadline_type: searchParams.get("deadline_type") || "",
      status: searchParams.get("status") || "",
      due_from: searchParams.get("due_from") || "",
      due_to: searchParams.get("due_to") || "",
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
      due_from: toOptionalString(filters.due_from),
      due_to: toOptionalString(filters.due_to),
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
      client_record_id: number;
      deadline_type: string;
      due_date: string;
      period?: string | null;
      tax_year?: number | null;
      payment_amount?: string | null;
      description?: string | null;
    }) => taxDeadlinesApi.createTaxDeadline(payload),
    onSuccess: (_data) => {
      toast.success("מועד נוצר בהצלחה");
      invalidateAfterMutation();
      setShowCreateModal(false);
    },
    onError: (error) => {
      if (getHttpStatus(error) === 409) {
        toast.error(DUPLICATE_TAX_DEADLINE_MESSAGE);
        return;
      }
      showErrorToast(error, "שגיאה ביצירת מועד");
    },
  });

  const generateMutation = useMutation({
    mutationFn: (payload: { client_record_id: number; year: number }) => taxDeadlinesApi.generateDeadlines(payload),
    onSuccess: ({ created_count }) => {
      if (created_count > 0) {
        toast.success(`נוצרו ${created_count} מועדים בהצלחה`);
      } else {
        toast.success("לא נוצרו מועדים חדשים");
      }
      invalidateAfterMutation();
      setShowGenerateModal(false);
    },
    onError: (error) => showErrorToast(error, "שגיאה ביצירת מועדים אוטומטית"),
  });

  const form = useForm<CreateTaxDeadlineForm>({
    defaultValues: {
      client_id: "",
      deadline_type: "vat",
      due_date: "",
      period: "",
      payment_amount: "",
      description: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const duplicate = await deadlineActions.findDuplicateDeadline(values);
    if (duplicate) {
      form.setError("period", { type: "manual", message: DUPLICATE_TAX_DEADLINE_MESSAGE });
      toast.error(DUPLICATE_TAX_DEADLINE_MESSAGE);
      return;
    }
    await createMutation.mutateAsync({
      client_record_id: Number(values.client_id),
      deadline_type: values.deadline_type,
      due_date: values.due_date,
      period: toDeadlinePayloadPeriod(values),
      tax_year: toDeadlinePayloadTaxYear(values),
      payment_amount: values.payment_amount ? values.payment_amount : null,
      description: values.description || null,
    });
    form.reset();
  });

  const generateForm = useForm<GenerateTaxDeadlinesForm>({
    defaultValues: {
      client_id: "",
      year: String(new Date().getFullYear()),
    },
  });

  const onGenerateSubmit = generateForm.handleSubmit(async (values) => {
    await generateMutation.mutateAsync({
      client_record_id: Number(values.client_id),
      year: Number(values.year),
    });
    generateForm.reset({ client_id: "", year: values.year });
  });

  const handleFilterChange = (key: string, value: string) => {
    if (key === "client_name") {
      setFilter("business_name", "");
    }
    setFilter(key, value);
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
    isUpdating: deadlineActions.isUpdating,
    completingId: deadlineActions.completingId,
    reopeningId: deadlineActions.reopeningId,
    deletingId: deadlineActions.deletingId,
    showCreateModal,
    showGenerateModal,
    editingDeadline: deadlineActions.editingDeadline,
    // Actions
    setShowCreateModal,
    setShowGenerateModal,
    setEditingDeadline: deadlineActions.setEditingDeadline,
    handleFilterChange,
    handleComplete: deadlineActions.handleComplete,
    handleReopen: deadlineActions.handleReopen,
    handleEdit: deadlineActions.handleEdit,
    handleDelete: deadlineActions.handleDelete,
    // Forms
    form,
    onSubmit,
    generateForm,
    onGenerateSubmit,
    editForm: deadlineActions.editForm,
    onEditSubmit: deadlineActions.onEditSubmit,

    // Permissions
    isAdvisor,
    isGenerating: generateMutation.isPending,
  };
};
