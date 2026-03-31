import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { bindersApi, bindersQK } from "../api";
import { clientsApi, clientsQK } from "@/features/clients/api";
import { taxProfileApi, taxProfileQK } from "@/features/taxProfile/api";
import { vatReportsApi } from "@/features/vatReports/api";
import { useAuthStore } from "../../../store/auth.store";
import { toast } from "../../../utils/toast";
import { showErrorToast } from "../../../utils/utils";
import { receiveBinderSchema, type ReceiveBinderFormValues } from "../schemas";

const getDefaultValues = (): ReceiveBinderFormValues => ({
  client_id: undefined as unknown as number,
  business_id: undefined as unknown as number | null,
  binder_type: "",
  open_new_binder: false,
  reporting_period: null,
  received_at: format(new Date(), "yyyy-MM-dd"),
  notes: null,
});

export const useReceiveBinderDrawer = (onSuccess?: () => void) => {
  const [clientQuery, setClientQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string; client_status?: string | null } | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userId = useAuthStore((s) => s.user?.id);

  const form = useForm<ReceiveBinderFormValues>({
    resolver: zodResolver(receiveBinderSchema),
    defaultValues: getDefaultValues(),
  });

  const clientId: number | undefined = form.watch("client_id");
  const binderType: string = form.watch("binder_type") ?? "";
  const businessId = form.watch("business_id");

  useEffect(() => {
    form.setValue("reporting_period", null);
  }, [binderType, form]);

  useEffect(() => {
    form.setValue("reporting_period", null);
  }, [businessId, form]);

  const { data: businessesData } = useQuery({
    queryKey: clientsQK.businesses(clientId!),
    queryFn: () => clientsApi.listBusinessesForClient(clientId!),
    enabled: !!clientId,
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const businesses = useMemo(() => businessesData?.items ?? [], [businessesData?.items]);

  useEffect(() => {
    if (businesses.length === 1) {
      form.setValue("business_id", businesses[0].id, { shouldValidate: true });
    }
  }, [businesses, form]);

  const { data: clientBindersData } = useQuery({
    queryKey: bindersQK.list({ client_id: clientId, page_size: 10 }),
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
    queryKey: taxProfileQK.forBusiness(businessId!),
    queryFn: () => taxProfileApi.get(businessId!),
    enabled: typeof businessId === "number" && businessId > 0,
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
      return bindersApi.receive({
        client_id: values.client_id,
        received_at: values.received_at,
        received_by: userId!,
        open_new_binder: values.open_new_binder ?? false,
        notes: values.notes ?? null,
        materials: [{
          material_type: values.binder_type,
          business_id: values.business_id ?? null,
          description: values.reporting_period ?? null,
        }],
      });
    },
    onSuccess: async (result, values) => {
      toast.success(result.is_new_binder ? "קלסר חדש נפתח והחומר נקלט" : "החומר נוסף לקלסר קיים");
      await queryClient.invalidateQueries({ queryKey: bindersQK.all });

      if (values.binder_type === "vat" && values.business_id && values.reporting_period) {
        const period = values.reporting_period.slice(0, 7);
        try {
          const existing = await vatReportsApi.lookup(values.business_id, period);
          if (existing) {
            toast.info("קיים תיק מע״מ לתקופה זו", {
              action: { label: "פתח", onClick: () => navigate(`/tax/vat/${existing.id}`) },
            });
          } else {
            toast.info('לא קיים תיק מע"מ לתקופה זו', {
              action: {
                label: "צור תיק מע״מ",
                onClick: () => navigate(`/tax/vat?create=1&business_id=${values.business_id}&period=${period}`),
              },
            });
          }
        } catch {
          // lookup failed — silently ignore
        }
      }

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
    form.setValue("reporting_period", null);
    form.setValue("business_id", undefined as unknown as number | null);
  };

  const handleClientQueryChange = (query: string) => {
    setClientQuery(query);
    if (selectedClient) {
      setSelectedClient(null);
      form.setValue("client_id", undefined as unknown as number);
      form.setValue("reporting_period", null);
      form.setValue("business_id", undefined as unknown as number | null);
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
