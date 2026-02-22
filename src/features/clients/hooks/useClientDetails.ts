import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsApi, type UpdateClientPayload, type ClientResponse } from "../../../api/clients.api";
import { bindersApi } from "../../../api/binders.api";
import { chargesApi } from "../../../api/charges.api";
import { getErrorMessage } from "../../../utils/utils";
import { toast } from "../../../utils/toast";
import type { ClientBinderSummary, ClientChargeSummary } from "../types";
import { QK } from "../../../lib/queryKeys";
import { useRole } from "../../../hooks/useRole";

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
  const { isAdvisor, can } = useRole();

  const clientQuery = useQuery({
    queryKey: QK.clients.detail(id),
    queryFn: () => clientsApi.getById(id),
    enabled,
  });

  const bindersQuery = useQuery({
    // Include page/page_size in key so cache is scoped correctly
    queryKey: QK.binders.forClientPage(id, BINDERS_PAGE.page, BINDERS_PAGE.page_size),
    queryFn: () => bindersApi.listClientBinders(id, BINDERS_PAGE),
    enabled,
  });

  const chargesQuery = useQuery({
    // Include page/page_size in key so cache is scoped correctly
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
      toast.error(getErrorMessage(err, "שגיאה בעדכון פרטי לקוח")),
  });

  const updateClient = async (payload: UpdateClientPayload) => {
    await updateMutation.mutateAsync(payload);
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
    can,
  };
};
