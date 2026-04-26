import { useState, useMemo } from "react";
import { useQueries, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { remindersApi, remindersQK } from "../api";
import { getErrorMessage, getHttpStatus, showErrorToast } from "../../../utils/utils";
import { toast } from "../../../utils/toast";
import type { Reminder } from "../api";
import type { CreateReminderRequest, ReminderStatus } from "../types";
import {
  createReminderSchema,
  createReminderDefaultValues,
  type CreateReminderFormValues,
} from "../schemas";
import { useReminderLinkedEntities } from "./useReminderLinkedEntities";

const makeDefaultFormValues = (
  clientRecordId?: number,
): CreateReminderFormValues => ({
  ...createReminderDefaultValues,
  client_record_id: clientRecordId ? String(clientRecordId) : "",
});

const ACTIVE_REMINDER_STATUSES: ReminderStatus[] = ["pending", "processing", "sent"];
const DUPLICATE_REMINDER_MESSAGE = "קיימת כבר תזכורת פעילה לאותו לקוח, סוג ותאריך יעד";

const buildPayload = (
  values: CreateReminderFormValues,
  fixedClientRecordId?: number,
): CreateReminderRequest => {
  const clientRecordId = fixedClientRecordId ?? Number(values.client_record_id);
  const businessId = values.business_id ? Number(values.business_id) : undefined;
  const scheduling = {
    target_date: values.target_date,
    days_before: values.days_before,
    message: values.message || undefined,
  };

  // Client-scoped types — owner resolved from the linked entity on the backend.
  if (values.reminder_type === "tax_deadline_approaching") {
    return {
      ...scheduling,
      reminder_type: "tax_deadline_approaching",
      client_record_id: clientRecordId,
      tax_deadline_id: Number(values.tax_deadline_id),
    };
  }
  if (values.reminder_type === "vat_filing") {
    return {
      ...scheduling,
      reminder_type: "vat_filing",
      tax_deadline_id: Number(values.tax_deadline_id),
    };
  }
  if (values.reminder_type === "annual_report_deadline") {
    return {
      ...scheduling,
      reminder_type: "annual_report_deadline",
      annual_report_id: Number(values.annual_report_id),
    };
  }
  if (values.reminder_type === "binder_idle") {
    return {
      ...scheduling,
      reminder_type: "binder_idle",
      binder_id: Number(values.binder_id),
    };
  }

  // Business-scoped types — business_id required; resolved from the form field (populated by linked entity selection).
  if (values.reminder_type === "unpaid_charge") {
    return {
      ...scheduling,
      reminder_type: "unpaid_charge",
      client_record_id: clientRecordId,
      business_id: businessId as number,
      charge_id: Number(values.charge_id),
    };
  }
  if (values.reminder_type === "advance_payment_due") {
    return {
      ...scheduling,
      reminder_type: "advance_payment_due",
      business_id: businessId as number,
      advance_payment_id: Number(values.advance_payment_id),
    };
  }
  if (values.reminder_type === "document_missing") {
    return { ...scheduling, reminder_type: "document_missing", business_id: businessId as number };
  }
  // custom — backend accepts client_record_id or business_id; prefer client_record_id.
  return {
    ...scheduling,
    reminder_type: "custom",
    client_record_id: clientRecordId,
    business_id: businessId,
    message: values.message as string,
  };
};

export const useReminders = (opts?: { clientId?: number; clientName?: string }) => {
  const clientId = opts?.clientId;
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [markingSentId, setMarkingSentId] = useState<number | null>(null);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  const form = useForm<CreateReminderFormValues>({
    defaultValues: makeDefaultFormValues(clientId),
    resolver: zodResolver(createReminderSchema),
  });

  const watchedClientRecordId = form.watch("client_record_id");
  const watchedReminderType = form.watch("reminder_type");
  // When the hook is used with a fixed clientId, use that; otherwise use the form value.
  const activeClientId = clientId ?? (watchedClientRecordId ? Number(watchedClientRecordId) : undefined);

  const linkedEntities = useReminderLinkedEntities(
    activeClientId,
    watchedReminderType,
    showCreateModal,
  );

  const remindersQuery = useQuery({
    queryKey: remindersQK.list(clientId, statusFilter),
    queryFn: () =>
      remindersApi.list({
        ...(clientId ? { client_record_id: clientId } : {}),
        ...(statusFilter ? { status: statusFilter as import("../api/contracts").ReminderStatus } : {}),
      }),
    enabled: clientId !== 0,
  });

  const pendingCountQuery = useQuery({
    queryKey: remindersQK.count(clientId, "pending"),
    queryFn: () =>
      remindersApi.list({
        ...(clientId ? { client_record_id: clientId } : {}),
        status: "pending",
        page_size: 1,
      }),
    enabled: clientId !== 0 && statusFilter !== "pending",
  });

  const sentCountQuery = useQuery({
    queryKey: remindersQK.count(clientId, "sent"),
    queryFn: () =>
      remindersApi.list({
        ...(clientId ? { client_record_id: clientId } : {}),
        status: "sent",
        page_size: 1,
      }),
    enabled: clientId !== 0 && statusFilter !== "sent",
  });

  const pendingCount =
    statusFilter === "pending"
      ? (remindersQuery.data?.total ?? 0)
      : (pendingCountQuery.data?.total ?? 0);

  const sentCount =
    statusFilter === "sent"
      ? (remindersQuery.data?.total ?? 0)
      : (sentCountQuery.data?.total ?? 0);

  const activeReminderQueries = useQueries({
    queries: ACTIVE_REMINDER_STATUSES.map((status) => ({
      queryKey: remindersQK.list(activeClientId, status),
      queryFn: () =>
        remindersApi.list({
          client_record_id: activeClientId,
          status,
          page_size: 500,
        }),
      enabled: showCreateModal && activeClientId != null && activeClientId > 0,
    })),
  });

  const activeReminders = useMemo(
    () => activeReminderQueries.flatMap((query) => query.data?.items ?? []),
    [activeReminderQueries],
  );

  const reminders = useMemo(() => {
    let items = remindersQuery.data?.items ?? [];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter((r) => r.client_name?.toLowerCase().includes(q));
    }
    if (typeFilter) {
      items = items.filter((r) => r.reminder_type === typeFilter);
    }
    return items;
  }, [remindersQuery.data?.items, search, typeFilter]);

  const hasFilters = !!search || !!typeFilter;

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("");
  };

  const createMutation = useMutation({
    mutationFn: remindersApi.create,
    onSuccess: () => {
      toast.success("תזכורת נוצרה בהצלחה");
      queryClient.invalidateQueries({ queryKey: remindersQK.all });
      setShowCreateModal(false);
      form.reset(makeDefaultFormValues(clientId));
    },
    onError: (err) => {
      if (getHttpStatus(err) === 409) {
        toast.error(DUPLICATE_REMINDER_MESSAGE);
        return;
      }
      showErrorToast(err, "שגיאה ביצירת תזכורת");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: remindersApi.cancel,
    onSuccess: () => {
      toast.success("תזכורת בוטלה");
      queryClient.invalidateQueries({ queryKey: remindersQK.all });
    },
    onError: (error) => showErrorToast(error, "שגיאה בביטול תזכורת"),
    onSettled: () => setCancelingId(null),
  });

  const markSentMutation = useMutation({
    mutationFn: remindersApi.markSent,
    onSuccess: () => {
      toast.success("תזכורת סומנה כנשלחה");
      queryClient.invalidateQueries({ queryKey: remindersQK.all });
    },
    onError: (error) => showErrorToast(error, "שגיאה בסימון התזכורת"),
    onSettled: () => setMarkingSentId(null),
  });

  const onSubmit = form.handleSubmit((values) => {
    const duplicateClientId = clientId ?? Number(values.client_record_id);
    const hasDuplicate = activeReminders.some(
      (reminder) =>
        reminder.client_record_id === duplicateClientId &&
        reminder.reminder_type === values.reminder_type &&
        reminder.target_date === values.target_date,
    );
    if (hasDuplicate) {
      form.setError("target_date", { type: "manual", message: DUPLICATE_REMINDER_MESSAGE });
      toast.error(DUPLICATE_REMINDER_MESSAGE);
      return;
    }
    void createMutation.mutateAsync(buildPayload(values, clientId));
  });

  const handleCancel = (id: number) => {
    setCancelingId(id);
    void cancelMutation.mutateAsync(id);
  };

  const handleMarkSent = (id: number) => {
    setMarkingSentId(id);
    void markSentMutation.mutateAsync(id);
  };

  return {
    reminders,
    rawTotal: remindersQuery.data?.total ?? 0,
    isLoading: remindersQuery.isLoading,
    error: remindersQuery.error
      ? getErrorMessage(remindersQuery.error, "שגיאה בטעינת תזכורות")
      : null,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    hasFilters,
    clearFilters,
    pendingCount,
    sentCount,
    showCreateModal,
    setShowCreateModal,
    form,
    onSubmit,
    isSubmitting: createMutation.isPending,
    cancelingId,
    handleCancel,
    markingSentId,
    handleMarkSent,
    selectedReminder,
    setSelectedReminder,
    ...linkedEntities,
  };
};
