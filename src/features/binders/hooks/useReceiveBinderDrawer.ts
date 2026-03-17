import { useState } from "react";
import { format } from "date-fns";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bindersApi } from "../../../api/binders.api";
import { toast } from "../../../utils/toast";
import { showErrorToast } from "../../../utils/utils";
import { useAuthStore } from "../../../store/auth.store";
import { QK } from "../../../lib/queryKeys";
import { receiveBinderSchema, type ReceiveBinderFormValues } from "../schemas";

const getDefaultValues = (): ReceiveBinderFormValues => ({
  client_id: undefined as unknown as number,
  binder_type: "",
  binder_number: "",
  received_at: format(new Date(), "yyyy-MM-dd"),
  notes: null,
});

export const useReceiveBinderDrawer = (onSuccess?: () => void) => {
  const [clientQuery, setClientQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string; client_status?: string | null } | null>(null);
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  const form = useForm<ReceiveBinderFormValues>({
    resolver: zodResolver(receiveBinderSchema),
    defaultValues: getDefaultValues(),
  });

  const resetState = () => {
    form.reset(getDefaultValues());
    setClientQuery("");
    setSelectedClient(null);
  };

  const binderNumber = useWatch({ control: form.control, name: "binder_number" });

  const { data: activeBinderData } = useQuery({
    queryKey: QK.binders.list({ binder_number: binderNumber }),
    queryFn: () => bindersApi.list({ binder_number: binderNumber, page_size: 1 }),
    enabled: binderNumber.trim().length >= 2,
    staleTime: 5000,
  });
  const activeBinder = activeBinderData?.items?.[0] ?? null;

  const mutation = useMutation({
    mutationFn: (values: ReceiveBinderFormValues) =>
      bindersApi.receive({
        client_id: values.client_id,
        binder_type: values.binder_type,
        binder_number: values.binder_number,
        received_at: values.received_at,
        received_by: userId!,
        notes: values.notes ?? null,
      }),
    onSuccess: async (result) => {
      toast.success(result.is_new_binder ? "קלסר חדש נפתח והחומר נקלט" : "החומר נוסף לקלסר קיים");
      await queryClient.invalidateQueries({ queryKey: QK.binders.all });
      resetState();
      onSuccess?.();
    },
    onError: (err) => {
      showErrorToast(err, "שגיאה בקליטת חומר");
    },
  });

  const handleClientSelect = (client: { id: number; name: string; id_number: string; client_status?: string | null }) => {
    setSelectedClient({ id: client.id, name: client.name, client_status: client.client_status });
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

  const handleReset = () => resetState();

  const handleSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return {
    form,
    clientQuery,
    selectedClient,
    activeBinder,
    isSubmitting: mutation.isPending,
    handleSubmit,
    handleClientSelect,
    handleClientQueryChange,
    handleReset,
  };
};
