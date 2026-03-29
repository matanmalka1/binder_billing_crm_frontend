import { useQuery } from "@tanstack/react-query";
import { clientsApi, clientsQK } from "../api";

export const useFirstBusinessId = (clientId: number) => {
  const { data } = useQuery({
    queryKey: clientsQK.businesses(clientId),
    queryFn: () => clientsApi.listBusinessesForClient(clientId),
    staleTime: 60_000,
  });

  return data?.items?.[0]?.id ?? null;
};
