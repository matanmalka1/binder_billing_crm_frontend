import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { bindersApi } from "../api";
import { clientsApi } from "@/features/clients/api";
import { taxProfileApi } from "@/features/taxProfile/api";
import { QK } from "../../../lib/queryKeys";
import { useAuthStore } from "../../../store/auth.store";
import { toast } from "../../../utils/toast";
import { showErrorToast } from "../../../utils/utils";
import { receiveBinderSchema, type ReceiveBinderFormValues } from "../schemas";

const getDefaultValues = (): ReceiveBinderFormValues => ({
  client_id: undefined as unknown as number,
  business_id: null,
  binder_type: "",
  open_new_binder: false,
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

  const { data: businessesData } = useQuery({
    queryKey: QK.clients.businesses(clientId!),
    queryFn: () => clientsApi.listBusinessesForClient(clientId!),
    enabled: !!clientId,
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const businesses = businessesData?.items ?? [];

  useEffect(() => {
    if (businesses.length === 1) {
      form.setValue("business_id", businesses[0].id);
    } else {
      form.setValue("business_id", null);
    }
  }, [businesses.length, businesses[0]?.id]);

  const { data: clientBindersData } = useQuery({
    queryKey: QK.binders.list({ client_id: clientId, page_size: 10 }),
    queryFn: () => bindersApi.list({ client_id: clientId, page_size: 10 }),
    enabled: !!clientId,
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const hasActiveBinder = (clientBindersData?.items ?? []).some(
    (b) => b.status !== "returned" && !b.is_full,
  );

  const { data: taxProfile } = useQuery({
    queryKey: QK.clients.taxProfile(clientId!),
    queryFn: () => taxProfileApi.get(clientId!),
    enabled: !!clientId && binderType === "vat",
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const vatType = taxProfile?.vat_type ?? null;

  const resetState = () => {
    form.reset(getDefaultValues());
    setClientQuery("");
    setSelectedClient(null);
  };

  const mutation = useMutation({
    mutationFn: (values: ReceiveBinderFormValues) => {
      const notesWithPeriod = values.binder_type === "vat" && values.vat_period
        ? [values.vat_period, values.notes].filter(Boolean).join(" | ")
        : values.notes ?? null;

      return bindersApi.receive({
        client_id: values.client_id,
        received_at: values.received_at,
        received_by: userId!,
        open_new_binder: values.open_new_binder ?? false,
        notes: notesWithPeriod,
        materials: [{ material_type: values.binder_type, business_id: values.business_id ?? null }],
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
    form.setValue("vat_period", null);
  };

  const handleClientQueryChange = (query: string) => {
    setClientQuery(query);
    if (selectedClient) {
      setSelectedClient(null);
      form.setValue("client_id", undefined as unknown as number);
      form.setValue("vat_period", null);
    }
  };

  const handleReset = () => resetState();
  const handleSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return {
    form,
    clientQuery,
    selectedClient,
    businesses,
    hasActiveBinder,
    vatType,
    isSubmitting: mutation.isPending,
    handleSubmit,
    handleClientSelect,
    handleClientQueryChange,
    handleReset,
  };
};
