import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { remindersApi, remindersQK } from "../api";
import { getErrorMessage, showErrorToast } from "../../../utils/utils";
import { toast } from "../../../utils/toast";
import type { Reminder } from "../api";
import type { CreateReminderRequest } from "../types";
import {
  createReminderSchema,
  createReminderDefaultValues,
  type CreateReminderFormValues,
} from "../schemas";
import { useReminderLinkedEntities } from "./useReminderLinkedEntities";

const makeDefaultFormValues = (
  clientId?: number,
): CreateReminderFormValues => ({
  ...createReminderDefaultValues,
  client_id: clientId ? String(clientId) : "",
});

const buildPayload = (
  values: CreateReminderFormValues,
  fixedClientId?: number,
): CreateReminderRequest => {
  const clientId = fixedClientId ?? Number(values.client_id);
  const scheduling = {
    target_date: values.target_date,
    days_before: values.days_before,
    message: values.message || undefined,
  };

  // Client-scoped types — owner derived from the linked entity on the backend.
  if (values.reminder_type === "tax_deadline_approaching") {
    return {
      ...scheduling,
      reminder_type: "tax_deadline_approaching",
      client_id: clientId,
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

  // Business-scoped types — must name the business explicitly.
  const businessId = clientId; // form field "client_id" holds the business_id for these types
  const businessBase = { ...scheduling, business_id: businessId };
  if (values.reminder_type === "advance_payment_due") {
    return { ...businessBase, reminder_type: "advance_payment_due", advance_payment_id: Number(values.advance_payment_id) };
  }
  if (values.reminder_type === "unpaid_charge") {
    return { ...businessBase, reminder_type: "unpaid_charge", charge_id: Number(values.charge_id) };
  }
  if (values.reminder_type === "document_missing") {
    return { ...businessBase, reminder_type: "document_missing" };
  }
  // custom — schema guarantees message is non-empty
  return { ...businessBase, reminder_type: "custom", message: values.message as string };
};

export const useReminders = (opts?: { clientId?: number; clientName?: string }) => {
  const clientId = opts?.clientId;
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [markingSentId, setMarkingSentId] = useState<number | null>(null);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("pending");

  const form = useForm<CreateReminderFormValues>({
    defaultValues: makeDefaultFormValues(clientId),
    resolver: zodResolver(createReminderSchema),
  });

  const watchedClientId = form.watch("client_id");
  const watchedReminderType = form.watch("reminder_type");
  // When the hook is used with a fixed clientId, use that; otherwise use the form value.
  const activeClientId = clientId ?? (watchedClientId ? Number(watchedClientId) : undefined);

  const linkedEntities = useReminderLinkedEntities(
    activeClientId,
    watchedReminderType,
    showCreateModal,
  );

  const remindersQuery = useQuery({
    queryKey: remindersQK.list(clientId, statusFilter),
    queryFn: () =>
      remindersApi.list({
        ...(clientId ? { client_id: clientId } : {}),
        ...(statusFilter ? { status: statusFilter as import("../api/contracts").ReminderStatus } : {}),
      }),
    enabled: clientId !== 0,
  });

  const pendingCountQuery = useQuery({
    queryKey: remindersQK.list(clientId, "pending"),
    queryFn: () =>
      remindersApi.list({
        ...(clientId ? { client_id: clientId } : {}),
        status: "pending",
        page_size: 1,
      }),
    enabled: clientId !== 0 && statusFilter !== "pending",
  });

  const sentCountQuery = useQuery({
    queryKey: remindersQK.list(clientId, "sent"),
    queryFn: () =>
      remindersApi.list({
        ...(clientId ? { client_id: clientId } : {}),
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

  const createMutation = useMutation({
    mutationFn: remindersApi.create,
    onSuccess: () => {
      toast.success("תזכורת נוצרה בהצלחה");
      queryClient.invalidateQueries({ queryKey: remindersQK.all });
      setShowCreateModal(false);
      form.reset(makeDefaultFormValues(clientId));
    },
    onError: (err) => showErrorToast(err, "שגיאה ביצירת תזכורת"),
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
    reminders: remindersQuery.data?.items ?? [],
    isLoading: remindersQuery.isLoading,
    error: remindersQuery.error
      ? getErrorMessage(remindersQuery.error, "שגיאה בטעינת תזכורות")
      : null,
    statusFilter,
    setStatusFilter,
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
