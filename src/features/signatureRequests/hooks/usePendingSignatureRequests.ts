import { useQuery } from "@tanstack/react-query";
import { signatureRequestsApi, signatureRequestsQK } from "../api";
import type { SignatureRequestResponse } from "../api";
import { clientsApi } from "@/features/clients/api";
import { getErrorMessage } from "../../../utils/utils";

type Params = { page?: number; pageSize?: number };

type Result = {
  items: SignatureRequestResponse[];
  total: number;
  businessLookup: Record<number, { name: string; clientId: number }>;
  isLoading: boolean;
  error: string | null;
};

export const usePendingSignatureRequests = ({ page = 1, pageSize = 50 }: Params = {}): Result => {
  const listQuery = useQuery({
    queryKey: signatureRequestsQK.pending({ page, page_size: pageSize }),
    queryFn: () => signatureRequestsApi.listPending({ page, page_size: pageSize }),
  });

  const items = listQuery.data?.items ?? [];
  const uniqueBusinessIds = [...new Set(items.map((r) => r.business_id))];

  const businessQueries = useQuery({
    queryKey: ["business-names-batch", uniqueBusinessIds],
    queryFn: async () => {
      const results = await Promise.all(uniqueBusinessIds.map((id) => clientsApi.getBusinessById(id)));
      return Object.fromEntries(
        results.map((business) => [
          business.id,
          {
            name: business.business_name ?? `עסק #${business.id}`,
            clientId: business.client_id,
          },
        ]),
      );
    },
    enabled: uniqueBusinessIds.length > 0,
  });

  return {
    items,
    total: listQuery.data?.total ?? 0,
    businessLookup: businessQueries.data ?? {},
    isLoading: listQuery.isLoading,
    error: listQuery.error ? getErrorMessage(listQuery.error, "שגיאה בטעינת בקשות חתימה") : null,
  };
};
