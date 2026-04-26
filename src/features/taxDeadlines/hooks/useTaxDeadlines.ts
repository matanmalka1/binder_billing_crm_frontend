import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParamFilters } from "../../../hooks/useSearchParamFilters";
import { useRole } from "../../../hooks/useRole";
import { useForm } from "react-hook-form";
import { taxDeadlinesApi, taxDeadlinesQK } from "../api";
import { timelineQK } from "@/features/timeline";
import type { TaxDeadlineResponse } from "../api";
import { getHttpStatus, parsePositiveInt, showErrorToast } from "../../../utils/utils";
import { toOptionalString } from "../../../utils/filters";
import type {
  TaxDeadlineFilters,
  CreateTaxDeadlineForm,
  EditTaxDeadlineForm,
  GenerateTaxDeadlinesForm,
} from "../types";
import { toast } from "../../../utils/toast";
import { getErrorMessage } from "../../../utils/utils";

const DUPLICATE_TAX_DEADLINE_MESSAGE = "קיים כבר מועד פעיל לאותו לקוח, סוג ותקופה";

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
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [reopeningId, setReopeningId] = useState<number | null>(null);
  const [editingDeadline, setEditingDeadline] = useState<TaxDeadlineResponse | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: {
      id: number;
      payload: {
        deadline_type?: string;
        due_date?: string;
        period?: string | null;
        payment_amount?: string | null;
        description?: string | null;
      };
    }) => taxDeadlinesApi.updateTaxDeadline(id, payload),
    onSuccess: () => {
      toast.success("מועד עודכן בהצלחה");
      invalidateAfterMutation();
      setEditingDeadline(null);
    },
    onError: (error) => {
      if (getHttpStatus(error) === 409) {
        toast.error(DUPLICATE_TAX_DEADLINE_MESSAGE);
        return;
      }
      showErrorToast(error, "שגיאה בעדכון מועד");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (deadlineId: number) => taxDeadlinesApi.deleteTaxDeadline(deadlineId),
    onSuccess: () => {
      toast.success("מועד נמחק בהצלחה");
      invalidateAfterMutation();
    },
    onError: (error) => showErrorToast(error, "שגיאה במחיקת מועד"),
    onSettled: () => setDeletingId(null),
  });

  const completeMutation = useMutation({
    mutationFn: (deadlineId: number) => taxDeadlinesApi.completeTaxDeadline(deadlineId),
    onSuccess: () => {
      toast.success("מועד סומן כהושלם");
      invalidateAfterMutation();
    },
    onError: (error) => showErrorToast(error, "שגיאה בסימון מועד"),
    onSettled: () => setCompletingId(null),
  });

  const reopenMutation = useMutation({
    mutationFn: (deadlineId: number) => taxDeadlinesApi.reopenTaxDeadline(deadlineId),
    onSuccess: () => {
      toast.success("מועד הוחזר לממתין");
      invalidateAfterMutation();
    },
    onError: (error) => showErrorToast(error, "שגיאה בהחזרת המועד"),
    onSettled: () => setReopeningId(null),
  });

  const editForm = useForm<EditTaxDeadlineForm>({
    defaultValues: { deadline_type: "", due_date: "", period: "", payment_amount: "", description: "" },
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

  const findDuplicateDeadline = async (
    values: Pick<CreateTaxDeadlineForm, "client_id" | "deadline_type" | "period">,
    excludeId?: number,
  ): Promise<TaxDeadlineResponse | null> => {
    if (!values.period) return null;
    const response = await taxDeadlinesApi.listTaxDeadlines({
      client_record_id: Number(values.client_id),
      deadline_type: values.deadline_type,
      period: values.period,
      page: 1,
      page_size: 5,
    });
    return response.items.find((deadline) => deadline.id !== excludeId) ?? null;
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const duplicate = await findDuplicateDeadline(values);
    if (duplicate) {
      form.setError("period", { type: "manual", message: DUPLICATE_TAX_DEADLINE_MESSAGE });
      toast.error(DUPLICATE_TAX_DEADLINE_MESSAGE);
      return;
    }
    await createMutation.mutateAsync({
      client_record_id: Number(values.client_id),
      deadline_type: values.deadline_type,
      due_date: values.due_date,
      period: values.period || null,
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

  const onEditSubmit = editForm.handleSubmit(async (values) => {
    if (!editingDeadline) return;
    const duplicate = await findDuplicateDeadline(
      { ...values, client_id: String(editingDeadline.client_record_id) },
      editingDeadline.id,
    );
    if (duplicate) {
      editForm.setError("period", { type: "manual", message: DUPLICATE_TAX_DEADLINE_MESSAGE });
      toast.error(DUPLICATE_TAX_DEADLINE_MESSAGE);
      return;
    }
    await updateMutation.mutateAsync({
      id: editingDeadline.id,
      payload: {
        deadline_type: values.deadline_type || undefined,
        due_date: values.due_date || undefined,
        period: values.period || null,
        payment_amount: values.payment_amount ? values.payment_amount : null,
        description: values.description || null,
      },
    });
    editForm.reset();
  });

  const handleFilterChange = (key: string, value: string) => {
    if (key === "client_name") {
      setFilter("business_name", "");
    }
    setFilter(key, value);
  };

  const handleComplete = async (deadlineId: number) => {
    setCompletingId(deadlineId);
    await completeMutation.mutateAsync(deadlineId);
  };

  const handleReopen = async (deadlineId: number) => {
    setReopeningId(deadlineId);
    await reopenMutation.mutateAsync(deadlineId);
  };

  const handleEdit = (deadline: TaxDeadlineResponse) => {
    setEditingDeadline(deadline);
    editForm.reset({
      deadline_type: deadline.deadline_type,
      due_date: deadline.due_date,
      period: deadline.period ?? "",
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
    reopeningId,
    deletingId,
    showCreateModal,
    showGenerateModal,
    editingDeadline,
    // Actions
    setShowCreateModal,
    setShowGenerateModal,
    setEditingDeadline,
    handleFilterChange,
    handleComplete,
    handleReopen,
    handleEdit,
    handleDelete,
    // Forms
    form,
    onSubmit,
    generateForm,
    onGenerateSubmit,
    editForm,
    onEditSubmit,

    // Permissions
    isAdvisor,
    isGenerating: generateMutation.isPending,
  };
};
