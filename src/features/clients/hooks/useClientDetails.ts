import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsApi, type UpdateClientPayload, type ClientResponse } from "../../../api/clients.api";
import { bindersApi } from "../../../api/binders.api";
import { chargesApi } from "../../../api/charges.api";
import { getErrorMessage } from "../../../utils/utils";
import { toast } from "../../../utils/toast";
import { useRole } from "../../../hooks/useRole";

type UseClientDetailsParams = { clientId: number | null };

type UseClientDetailsResult = {
  client: ClientResponse | null;
  isValidId: boolean;
  isLoading: boolean;
  error: string | null;
  binders: { id: number; binder_number: string; received_at: string }[];
  bindersTotal: number;
  charges: { id: number; charge_type: string; status: string }[];
  chargesTotal: number;
  updateClient: (payload: UpdateClientPayload) => Promise<void>;
  isUpdating: boolean;
};

export const useClientDetails = ({
  clientId,
}: UseClientDetailsParams): UseClientDetailsResult => {
  const id = Number(clientId);
  const isValidId = Number.isFinite(id) && id > 0;
  const enabled = isValidId;
  const queryClient = useQueryClient();
  const { isAdvisor } = useRole();

  const clientQuery = useQuery({
    queryKey: ["clients", "detail", id],
    queryFn: () => clientsApi.getById(id),
    enabled,
  });
  const bindersQuery = useQuery({
    queryKey: ["binders", "client", id],
    queryFn: () => bindersApi.listClientBinders(id, { page: 1, page_size: 5 }),
    enabled,
  });
  const chargesQuery = useQuery({
    queryKey: ["charges", "client", id],
    queryFn: () => chargesApi.list({ client_id: id, page: 1, page_size: 5 }),
    enabled: enabled && isAdvisor,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateClientPayload) =>
      clientsApi.update(id, payload),
    onSuccess: async (updated) => {
      toast.success("פרטי הלקוח עודכנו");
      queryClient.setQueryData(["clients", "detail", id], updated);
      await queryClient.invalidateQueries({ queryKey: ["clients"] });
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
  };
};
