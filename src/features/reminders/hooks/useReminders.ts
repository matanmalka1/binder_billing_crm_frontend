import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { remindersApi } from "../../../api/reminders.api";
import { getErrorMessage, showErrorToast } from "../../../utils/utils";
import { toast } from "../../../utils/toast";
import { QK } from "../../../lib/queryKeys";
import type {
  CreateReminderRequest,
  CreateReminderFormValues,
} from "../reminder.types";

const makeDefaultFormValues = (
  clientId?: number,
): CreateReminderFormValues => ({
  reminder_type: "custom",
  target_date: "",
  client_id: clientId ? String(clientId) : "",
  days_before: 7,
  message: "",
});

const buildPayload = (
  values: CreateReminderFormValues,
  fixedClientId?: number,
): CreateReminderRequest | null => {
  const clientId = fixedClientId ?? Number(values.client_id);
  if (!clientId || clientId <= 0) return null;
  if (!values.target_date) return null;
  if (values.days_before < 0) return null;

  const base = {
    client_id: clientId,
    target_date: values.target_date,
    days_before: Number(values.days_before),
    message: values.message || undefined,
  };

  if (values.reminder_type === "tax_deadline_approaching") {
    const tax_deadline_id = Number(values.tax_deadline_id);
    if (!tax_deadline_id) return null;
    return {
      ...base,
      reminder_type: "tax_deadline_approaching",
      tax_deadline_id,
    };
  }

  if (values.reminder_type === "binder_idle") {
    const binder_id = Number(values.binder_id);
    if (!binder_id) return null;
    return { ...base, reminder_type: "binder_idle", binder_id };
  }

  if (values.reminder_type === "unpaid_charge") {
    const charge_id = Number(values.charge_id);
    if (!charge_id) return null;
    return { ...base, reminder_type: "unpaid_charge", charge_id };
  }

  // custom
  if (!values.message?.trim()) return null;
  return { ...base, reminder_type: "custom", message: values.message.trim() };
};

export const useReminders = (opts?: { clientId?: number }) => {
  const clientId = opts?.clientId;
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  const form = useForm<CreateReminderFormValues>({
    defaultValues: makeDefaultFormValues(clientId),
  });

  const remindersQuery = useQuery({
    queryKey: QK.reminders.list(clientId),
    queryFn: () =>
      remindersApi.list(clientId ? { client_id: clientId } : undefined),
  });

  const createMutation = useMutation({
    mutationFn: remindersApi.create,
    onSuccess: () => {
      toast.success("תזכורת נוצרה בהצלחה");
      queryClient.invalidateQueries({ queryKey: QK.reminders.all });
      queryClient.invalidateQueries({ queryKey: QK.reminders.list(clientId) });
      setShowCreateModal(false);
      form.reset(makeDefaultFormValues(clientId));
    },
    onError: (error) => showErrorToast(error, "שגיאה ביצירת תזכורת"),
  });

  const cancelMutation = useMutation({
    mutationFn: remindersApi.cancel,
    onSuccess: () => {
      toast.success("תזכורת בוטלה");
      queryClient.invalidateQueries({ queryKey: QK.reminders.all });
    },
    onError: (error) => showErrorToast(error, "שגיאה בביטול תזכורת"),
    onSettled: () => setCancelingId(null),
  });

  const onSubmit = form.handleSubmit((values) => {
    const payload = buildPayload(values, clientId);
    if (!payload) {
      // Surface validation errors for missing FK fields
      if (!values.client_id && !clientId)
        form.setError("client_id", { message: "נא להזין מזהה לקוח תקין" });
      if (!values.target_date)
        form.setError("target_date", { message: "נא לבחור תאריך יעד" });
      if (
        values.reminder_type === "tax_deadline_approaching" &&
        !values.tax_deadline_id
      )
        form.setError("tax_deadline_id", { message: "נא להזין מזהה מועד מס" });
      if (values.reminder_type === "binder_idle" && !values.binder_id)
        form.setError("binder_id", { message: "נא להזין מזהה תיק" });
      if (values.reminder_type === "unpaid_charge" && !values.charge_id)
        form.setError("charge_id", { message: "נא להזין מזהה חשבונית" });
      if (values.reminder_type === "custom" && !values.message?.trim())
        form.setError("message", { message: "נא להזין הודעת תזכורת" });
      return;
    }
    void createMutation.mutateAsync(payload);
  });

  const handleCancel = (id: number) => {
    setCancelingId(id);
    void cancelMutation.mutateAsync(id);
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
  };
};
