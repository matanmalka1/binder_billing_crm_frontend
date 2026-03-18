import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { bindersApi } from "../../../api/binders.api";
import { taxProfileApi } from "../../../api/taxProfile.api";
import { QK } from "../../../lib/queryKeys";
import { useAuthStore } from "../../../store/auth.store";
import { toast } from "../../../utils/toast";
import { showErrorToast } from "../../../utils/utils";
import { receiveBinderSchema, type ReceiveBinderFormValues } from "../schemas";
import type { BinderResponse } from "../types";

const getDefaultValues = (): ReceiveBinderFormValues => ({
  client_id: undefined as unknown as number,
  binder_type: "",
  binder_number: "",
  vat_period: null,
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

  const clientId: number | undefined = form.watch("client_id");
  const binderType: string = form.watch("binder_type") ?? "";

  useEffect(() => {
    if (binderType !== "vat") {
      form.setValue("vat_period", null);
    }
  }, [binderType, form]);

  const clientBindersQuery = useQuery({
    queryKey: QK.binders.list({ client_id: clientId, page_size: 50 }),
    queryFn: () => bindersApi.list({ client_id: clientId, page_size: 50 }),
    enabled: !!clientId,
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const allBindersQuery = useQuery({
    queryKey: QK.binders.list({ page_size: 100 }),
    queryFn: () => bindersApi.list({ page_size: 100 }),
    enabled: !clientId,
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { data: taxProfile } = useQuery({
    queryKey: QK.clients.taxProfile(clientId!),
    queryFn: () => taxProfileApi.get(clientId!),
    enabled: !!clientId && binderType === "vat",
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const vatType = taxProfile?.vat_type ?? null;

  const clientBindersData = clientBindersQuery.data;
  const allBindersData = allBindersQuery.data;
  const clientBinders: BinderResponse[] = clientBindersData?.items ?? [];
  const allBinders: BinderResponse[] = allBindersData?.items ?? [];

  const resetState = () => {
    form.reset(getDefaultValues());
    setClientQuery("");
    setSelectedClient(null);
  };

  const mutation = useMutation({
    mutationFn: (values: ReceiveBinderFormValues) => {
      const notesWithPeriod = values.vat_period
        ? [values.vat_period, values.notes].filter(Boolean).join(" | ")
        : values.notes ?? null;

      return bindersApi.receive({
        client_id: values.client_id,
        binder_type: values.binder_type,
        binder_number: values.binder_number,
        received_at: values.received_at,
        received_by: userId!,
        notes: notesWithPeriod,
      });
    },
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
    form.setValue("binder_number", "");
    form.setValue("vat_period", null);
  };

  const handleClientQueryChange = (query: string) => {
    setClientQuery(query);
    if (selectedClient) {
      setSelectedClient(null);
      form.setValue("client_id", undefined as unknown as number);
      form.setValue("binder_number", "");
      form.setValue("vat_period", null);
    }
  };

  const handleBinderSelect = (binderNumber: string, clientIdValue: number, clientName: string, clientStatus: string | null) => {
    form.setValue("binder_number", binderNumber, { shouldValidate: true });
    form.setValue("client_id", clientIdValue, { shouldValidate: true });
    form.setValue("vat_period", null);
    setSelectedClient({ id: clientIdValue, name: clientName, client_status: clientStatus });
    setClientQuery(clientName);
  };

  const handleReset = () => resetState();
  const handleSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return {
    form,
    clientQuery,
    selectedClient,
    clientBinders,
    allBinders,
    vatType,
    isSubmitting: mutation.isPending,
    handleSubmit,
    handleClientSelect,
    handleClientQueryChange,
    handleBinderSelect,
    handleReset,
  };
};
