import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { remindersApi } from "../../../api/reminders.api";
import { getErrorMessage, showErrorToast } from "../../../utils/utils";
import { useForm } from "react-hook-form";
import type {
  RemindersListResponse,
  CreateReminderRequest,
  CreateReminderFormValues,
} from "../reminder.types";
import { QK } from "../../../lib/queryKeys";
import { toast } from "../../../utils/toast";

const defaultFormValues: CreateReminderFormValues = {
  reminder_type: "custom",
  target_date: "",
  client_id: "",
  days_before: 7,
  message: "",
};

export const useReminders = () => {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  const remindersQuery = useQuery<RemindersListResponse, Error>({
    queryKey: QK.reminders.list,
    queryFn: () => remindersApi.list(),
  });

  const createMutation = useMutation({
    mutationFn: remindersApi.create,
    onSuccess: () => {
      toast.success("תזכורת נוצרה בהצלחה");
      queryClient.invalidateQueries({ queryKey: QK.reminders.all });
      setShowCreateModal(false);
      form.reset(defaultFormValues);
    },
    onError: (error) => {
      showErrorToast(error, "שגיאה ביצירת תזכורת");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: remindersApi.cancel,
    onSuccess: () => {
      toast.success("תזכורת בוטלה");
      queryClient.invalidateQueries({ queryKey: QK.reminders.all });
    },
    onError: (error) => {
      showErrorToast(error, "שגיאה בביטול תזכורת");
    },
    onSettled: () => {
      setCancelingId(null);
    },
  });

  const form = useForm<CreateReminderFormValues>({
    defaultValues: defaultFormValues,
  });

  const buildPayload = useMemo(
    () => (values: CreateReminderFormValues): CreateReminderRequest | null => {
      const clientId = Number(values.client_id);
      if (!clientId || clientId <= 0) {
        form.setError("client_id", { message: "נא להזין מזהה לקוח תקין" });
        return null;
      }

      if (!values.target_date) {
        form.setError("target_date", { message: "נא לבחור תאריך יעד" });
        return null;
      }

      if (values.days_before < 0) {
        form.setError("days_before", { message: "מספר ימים לפני חייב להיות חיובי" });
        return null;
      }

      if (values.reminder_type === "tax_deadline_approaching") {
        const taxDeadlineId = Number(values.tax_deadline_id);
        if (!taxDeadlineId) {
          form.setError("tax_deadline_id", { message: "נא להזין מזהה מועד מס" });
          return null;
        }
        return {
          client_id: clientId,
          target_date: values.target_date,
          days_before: Number(values.days_before),
          reminder_type: values.reminder_type,
          tax_deadline_id: taxDeadlineId,
          message: values.message || undefined,
        };
      }

      if (values.reminder_type === "binder_idle") {
        const binderId = Number(values.binder_id);
        if (!binderId) {
          form.setError("binder_id", { message: "נא להזין מזהה תיק" });
          return null;
        }
        return {
          client_id: clientId,
          target_date: values.target_date,
          days_before: Number(values.days_before),
          reminder_type: values.reminder_type,
          binder_id: binderId,
          message: values.message || undefined,
        };
      }

      if (values.reminder_type === "unpaid_charge") {
        const chargeId = Number(values.charge_id);
        if (!chargeId) {
          form.setError("charge_id", { message: "נא להזין מזהה חשבונית" });
          return null;
        }
        return {
          client_id: clientId,
          target_date: values.target_date,
          days_before: Number(values.days_before),
          reminder_type: values.reminder_type,
          charge_id: chargeId,
          message: values.message || undefined,
        };
      }

      if (!values.message || values.message.trim() === "") {
        form.setError("message", { message: "נא להזין הודעת תזכורת" });
        return null;
      }

      return {
        client_id: clientId,
        target_date: values.target_date,
        days_before: Number(values.days_before),
        reminder_type: "custom",
        message: values.message.trim(),
      };
    },
    [form],
  );

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = buildPayload(values);
    if (!payload) return;
    await createMutation.mutateAsync(payload);
  });

  const handleCancel = async (id: number) => {
    setCancelingId(id);
    await cancelMutation.mutateAsync(id);
  };

  return {
    reminders: remindersQuery.data?.items || [],
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
