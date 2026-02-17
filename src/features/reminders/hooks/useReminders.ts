import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { remindersApi } from "../../../api/reminders.api";
import { getErrorMessage } from "../../../utils/utils";
import { toast } from "../../../utils/toast";
import type { RemindersListResponse, CreateReminderRequest } from "../reminder.types";

// Start with a valid union variant to satisfy TS (custom has no required FK)
const defaultFormData: CreateReminderRequest = {
  client_id: 0,
  reminder_type: "custom",
  target_date: "",
  days_before: 7,
  message: "",
};

export const useReminders = () => {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<CreateReminderRequest>(defaultFormData);
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  const remindersQuery = useQuery<RemindersListResponse, Error>({
    queryKey: ["reminders", "list"],
    queryFn: () => remindersApi.list(),
  });

  const createMutation = useMutation({
    mutationFn: remindersApi.create,
    onSuccess: () => {
      toast.success("תזכורת נוצרה בהצלחה");
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      setShowCreateModal(false);
      setFormData(defaultFormData);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "שגיאה ביצירת תזכורת"));
    },
  });

  const cancelMutation = useMutation({
    mutationFn: remindersApi.cancel,
    onSuccess: () => {
      toast.success("תזכורת בוטלה");
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "שגיאה בביטול תזכורת"));
    },
    onSettled: () => {
      setCancelingId(null);
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.client_id || formData.client_id <= 0) {
      toast.error("נא להזין מזהה לקוח תקין");
      return;
    }
    if (!formData.target_date) {
      toast.error("נא לבחור תאריך יעד");
      return;
    }
    if (!formData.message || formData.message.trim() === "") {
      toast.error("נא להזין הודעת תזכורת");
      return;
    }
    if (formData.days_before < 0) {
      toast.error("מספר ימים לפני חייב להיות חיובי");
      return;
    }

    createMutation.mutate(formData);
  };

  const handleCancel = async (id: number) => {
    setCancelingId(id);
    await cancelMutation.mutateAsync(id);
  };

  const handleFormChange = (updates: Partial<CreateReminderRequest>) => {
    setFormData((prev) => {
      // If reminder type changes, clear incompatible FK fields to keep the union valid
      if (updates.reminder_type && updates.reminder_type !== prev.reminder_type) {
        const reset = { binder_id: undefined, charge_id: undefined, tax_deadline_id: undefined } as Partial<CreateReminderRequest>;
        return { ...prev, ...reset, ...updates } as CreateReminderRequest;
      }
      return { ...prev, ...updates } as CreateReminderRequest;
    });
  };

  return {
    reminders: remindersQuery.data?.items || [],
    isLoading: remindersQuery.isPending,
    error: remindersQuery.error
      ? getErrorMessage(remindersQuery.error, "שגיאה בטעינת תזכורות")
      : null,
    showCreateModal,
    setShowCreateModal,
    formData,
    handleFormChange,
    handleCreateSubmit,
    isSubmitting: createMutation.isPending,
    cancelingId,
    handleCancel,
  };
};
