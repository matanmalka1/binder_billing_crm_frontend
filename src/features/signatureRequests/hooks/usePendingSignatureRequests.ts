import { useQuery } from "@tanstack/react-query";
import { signatureRequestsApi } from "../../../api/signatureRequests.api";
import type { SignatureRequestResponse } from "../../../api/signatureRequests.api";
import { clientsApi } from "../../../api/clients.api";
import { getErrorMessage } from "../../../utils/utils";
import { QK } from "../../../lib/queryKeys";

type Params = { page?: number; pageSize?: number };

type Result = {
  items: SignatureRequestResponse[];
  total: number;
  clientNames: Record<number, string>;
  isLoading: boolean;
  error: string | null;
};

export const usePendingSignatureRequests = ({ page = 1, pageSize = 50 }: Params = {}): Result => {
  const listQuery = useQuery({
    queryKey: QK.signatureRequests.pending({ page, page_size: pageSize }),
    queryFn: () => signatureRequestsApi.listPending({ page, page_size: pageSize }),
  });

  const items = listQuery.data?.items ?? [];
  const uniqueClientIds = [...new Set(items.map((r) => r.client_id))];

  const clientQueries = useQuery({
    queryKey: ["client-names-batch", uniqueClientIds],
    queryFn: async () => {
      const results = await Promise.all(uniqueClientIds.map((id) => clientsApi.getById(id)));
      return Object.fromEntries(results.map((c) => [c.id, c.full_name]));
    },
    enabled: uniqueClientIds.length > 0,
  });

  return {
    items,
    total: listQuery.data?.total ?? 0,
    clientNames: clientQueries.data ?? {},
    isLoading: listQuery.isLoading,
    error: listQuery.error ? getErrorMessage(listQuery.error, "שגיאה בטעינת בקשות חתימה") : null,
  };
};