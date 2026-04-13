import { useQuery } from "@tanstack/react-query";
import { BUSINESS_QUERY_OPTIONS } from "@/features/businesses/queryOptions";
import { clientsApi, clientsQK } from "../api";

export const useFirstBusinessId = (clientId: number) => {
  const { data, isLoading } = useQuery({
    queryKey: clientsQK.firstBusiness(clientId),
    queryFn: () =>
      clientsApi.listBusinessesForClient(clientId, {
        page: 1,
        page_size: BUSINESS_QUERY_OPTIONS.firstBusiness.pageSize,
      }),
    enabled: clientId > 0,
    staleTime: BUSINESS_QUERY_OPTIONS.firstBusiness.staleTime,
  });

  return { id: data?.items?.[0]?.id ?? null, isLoading };
};
