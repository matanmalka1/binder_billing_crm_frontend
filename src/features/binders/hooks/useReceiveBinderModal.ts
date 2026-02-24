import { useState } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bindersApi } from "../../../api/binders.api";
import { toast } from "../../../utils/toast";
import { showErrorToast } from "../../../utils/utils";
import { useAuthStore } from "../../../store/auth.store";
import { QK } from "../../../lib/queryKeys";
import type { ReceiveBinderFormValues } from "../types";

const EMPTY_FORM_VALUES: ReceiveBinderFormValues = {
  client_id: undefined as unknown as number,
  binder_type: "",
  binder_number: "",
  received_at: "",
};

const getDefaultValues = (): ReceiveBinderFormValues => ({
  ...EMPTY_FORM_VALUES,
  received_at: format(new Date(), "yyyy-MM-dd"),
});

export const useReceiveBinderModal = () => {
  const [open, setOpen] = useState(false);
  const [clientQuery, setClientQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string } | null>(null);
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  const form = useForm<ReceiveBinderFormValues>({
    defaultValues: getDefaultValues(),
  });

  const resetState = () => {
    form.reset(getDefaultValues());
    setClientQuery("");
    setSelectedClient(null);
  };

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
      resetState();
    },
    onError: (err) => {
      showErrorToast(err, "שגיאה בקליטת חומר");
    },
  });

  const handleClientSelect = (client: { id: number; name: string; id_number: string }) => {
    setSelectedClient({ id: client.id, name: client.name });
    setClientQuery(client.name);
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
    resetState();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetState();
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