import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bindersApi } from "../../../api/binders.api";
import { toast } from "../../../utils/toast";
import { showErrorToast } from "../../../utils/utils";
import { useAuthStore } from "../../../store/auth.store";
import { QK } from "../../../lib/queryKeys";
import type { ReceiveBinderFormValues } from "../types";

export const useReceiveBinderModal = () => {
  const [open, setOpen] = useState(false);
  const [clientQuery, setClientQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string } | null>(null);
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  const form = useForm<ReceiveBinderFormValues>({
    defaultValues: {
      client_id: undefined,
      binder_type: "",
      binder_number: "",
      received_at: new Date().toISOString().slice(0, 10),
    },
  });

  const mutation = useMutation({
    mutationFn: (values: ReceiveBinderFormValues) =>
      bindersApi.receive({
        client_id: values.client_id,
        binder_type: values.binder_type,
        binder_number: values.binder_number,
        received_at: values.received_at,
        received_by: userId!,
      }),
    onSuccess: async () => {
      toast.success("החומר נקלט בהצלחה");
      await queryClient.invalidateQueries({ queryKey: QK.binders.all });
      setOpen(false);
      resetForm();
    },
    onError: (err) => {
      showErrorToast(err, "שגיאה בקליטת חומר");
    },
  });

  const resetForm = () => {
    form.reset({
      client_id: undefined,
      binder_type: "",
      binder_number: "",
      received_at: new Date().toISOString().slice(0, 10),
    });
    setClientQuery("");
    setSelectedClient(null);
  };

  const handleClientSelect = (client: { id: number; name: string; id_number: string }) => {
    setSelectedClient({ id: client.id, name: client.name });
    setClientQuery(`${client.name}`);
    form.setValue("client_id", client.id, { shouldValidate: true });
  };

  const handleClientQueryChange = (query: string) => {
    setClientQuery(query);
    if (selectedClient) {
      setSelectedClient(null);
      form.setValue("client_id", undefined as unknown as number);
    }
  };

  const handleOpen = () => {
    resetForm();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return {
    open,
    form,
    clientQuery,
    selectedClient,
    isSubmitting: mutation.isPending,
    handleOpen,
    handleClose,
    handleSubmit,
    handleClientSelect,
    handleClientQueryChange,
  };
};
