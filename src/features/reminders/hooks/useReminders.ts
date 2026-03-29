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

const makeDefaultFormValues = (
  businessId?: number,
): CreateReminderFormValues => ({
  ...createReminderDefaultValues,
  client_id: businessId ? String(businessId) : "",
});

const buildPayload = (
  values: CreateReminderFormValues,
  fixedBusinessId?: number,
): CreateReminderRequest => {
  // Schema guarantees all fields are valid at this point.
  const businessId = fixedBusinessId ?? Number(values.client_id);
  const base = {
    business_id: businessId,
    target_date: values.target_date,
    days_before: values.days_before,
    message: values.message || undefined,
  };

  if (values.reminder_type === "tax_deadline_approaching") {
    return {
      ...base,
      reminder_type: "tax_deadline_approaching",
      tax_deadline_id: Number(values.tax_deadline_id),
    };
  }
  if (values.reminder_type === "binder_idle") {
    return {
      ...base,
      reminder_type: "binder_idle",
      binder_id: Number(values.binder_id),
    };
  }
  if (values.reminder_type === "unpaid_charge") {
    return {
      ...base,
      reminder_type: "unpaid_charge",
      charge_id: Number(values.charge_id),
    };
  }
  // custom — schema guarantees message is non-empty
  return {
    ...base,
    reminder_type: "custom",
    message: values.message as string,
  };
};

export const useReminders = (opts?: { clientId?: number }) => {
  const clientId = opts?.clientId;
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [markingSentId, setMarkingSentId] = useState<number | null>(null);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);

  const form = useForm<CreateReminderFormValues>({
    defaultValues: makeDefaultFormValues(clientId),
    resolver: zodResolver(createReminderSchema),
  });

  const remindersQuery = useQuery({
    queryKey: remindersQK.list(clientId),
    queryFn: () =>
      remindersApi.list(clientId ? { business_id: clientId } : undefined),
  });

  const createMutation = useMutation({
    mutationFn: remindersApi.create,
    onSuccess: () => {
      toast.success("תזכורת נוצרה בהצלחה");
      queryClient.invalidateQueries({ queryKey: remindersQK.all });
      queryClient.invalidateQueries({ queryKey: remindersQK.list(clientId) });
      setShowCreateModal(false);
      form.reset(makeDefaultFormValues(clientId));
    },
    onError: (error) => showErrorToast(error, "שגיאה ביצירת תזכורת"),
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
    // zodResolver has already validated; buildPayload is now total (no null branch).
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
    isLoading: remindersQuery.isPending,
    error: remindersQuery.error
      ? getErrorMessage(remindersQuery.error, "שגיאה בטעינת תזכורות")
      : null,
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
  };
};
