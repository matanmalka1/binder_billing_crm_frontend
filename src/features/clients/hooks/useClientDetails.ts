import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { clientsApi, type UpdateClientPayload, type ClientResponse, type CreateBusinessPayload } from "../api";
import { bindersApi } from "@/features/binders/api";
import { chargesApi } from "@/features/charges/api";
import { getErrorMessage, showErrorToast } from "../../../utils/utils";
import type { ClientBinderSummary, ClientChargeSummary } from "../types";
import { QK } from "../../../lib/queryKeys";
import { useRole } from "../../../hooks/useRole";
import { toast } from "../../../utils/toast";

type UseClientDetailsParams = { clientId: number | null };

type UseClientDetailsResult = {
  client: ClientResponse | null;
  isValidId: boolean;
  isLoading: boolean;
  error: string | null;
  binders: ClientBinderSummary[];
  bindersTotal: number;
  charges: ClientChargeSummary[];
  chargesTotal: number;
  updateClient: (payload: UpdateClientPayload) => Promise<void>;
  isUpdating: boolean;
  deleteClient: () => Promise<void>;
  isDeleting: boolean;
  createBusiness: (payload: CreateBusinessPayload) => Promise<void>;
  isCreatingBusiness: boolean;
  can: ReturnType<typeof useRole>["can"];
};

const BINDERS_PAGE = { page: 1, page_size: 5 } as const;
const CHARGES_PAGE = { page: 1, page_size: 5 } as const;

export const useClientDetails = ({
  clientId,
}: UseClientDetailsParams): UseClientDetailsResult => {
  const id = Number(clientId);
  const isValidId = Number.isFinite(id) && id > 0;
  const enabled = isValidId;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isAdvisor, can } = useRole();

  const clientQuery = useQuery({
    queryKey: QK.clients.detail(id),
    queryFn: () => clientsApi.getById(id),
    enabled,
  });

  const bindersQuery = useQuery({
    queryKey: QK.binders.forClientPage(id, BINDERS_PAGE.page, BINDERS_PAGE.page_size),
    queryFn: () => bindersApi.listClientBinders(id, BINDERS_PAGE),
    enabled,
  });

  const chargesQuery = useQuery({
    queryKey: QK.charges.forClientPage(id, CHARGES_PAGE.page, CHARGES_PAGE.page_size),
    queryFn: () => chargesApi.list({ client_id: id, ...CHARGES_PAGE }),
    enabled: enabled && isAdvisor,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateClientPayload) =>
      clientsApi.update(id, payload),
    onSuccess: async (updated) => {
      toast.success("פרטי הלקוח עודכנו");
      queryClient.setQueryData(QK.clients.detail(id), updated);
      await queryClient.invalidateQueries({ queryKey: QK.clients.all });
    },
    onError: (err) =>
      showErrorToast(err, "שגיאה בעדכון פרטי לקוח"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => clientsApi.delete(id),
    onSuccess: async () => {
      toast.success("הלקוח נמחק בהצלחה");
      await queryClient.invalidateQueries({ queryKey: QK.clients.all });
      navigate("/clients");
    },
    onError: (err) => showErrorToast(err, "שגיאה במחיקת לקוח"),
  });

  const createBusinessMutation = useMutation({
    mutationFn: (payload: CreateBusinessPayload) =>
      clientsApi.createBusiness(id, payload),
    onSuccess: () => {
      toast.success("העסק נוצר בהצלחה");
      queryClient.invalidateQueries({ queryKey: QK.clients.businesses(id) });
    },
    onError: (err) => showErrorToast(err, "שגיאה ביצירת עסק"),
  });

  const updateClient = async (payload: UpdateClientPayload) => {
    await updateMutation.mutateAsync(payload);
  };

  const createBusiness = async (payload: CreateBusinessPayload) => {
    await createBusinessMutation.mutateAsync(payload);
  };

  return {
    client: clientQuery.data ?? null,
    isValidId,
    isLoading: clientQuery.isLoading,
    error: clientQuery.error
      ? getErrorMessage(clientQuery.error, "שגיאה בטעינת פרטי לקוח")
      : null,
    binders: bindersQuery.data?.items ?? [],
    bindersTotal: bindersQuery.data?.total ?? 0,
    charges: chargesQuery.data?.items ?? [],
    chargesTotal: chargesQuery.data?.total ?? 0,
    updateClient,
    isUpdating: updateMutation.isPending,
    deleteClient: () => deleteMutation.mutateAsync(),
    isDeleting: deleteMutation.isPending,
    createBusiness,
    isCreatingBusiness: createBusinessMutation.isPending,
    can,
  };
};
