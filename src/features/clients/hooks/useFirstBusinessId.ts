import { useQuery } from "@tanstack/react-query";
import { clientsApi, clientsQK } from "../api";

export const useFirstBusinessId = (clientId: number) => {
  const { data } = useQuery({
    queryKey: clientsQK.firstBusiness(clientId),
    queryFn: () => clientsApi.listBusinessesForClient(clientId, { page: 1, page_size: 1 }),
    staleTime: 60_000,
  });

  return data?.items?.[0]?.id ?? null;
};
