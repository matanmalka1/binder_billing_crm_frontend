import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { clientsApi, clientsQK } from "@/features/clients/api";
import type { BusinessResponse } from "@/features/clients/api";

interface UseBusinessesForClientOptions {
  clientId: number | null | undefined;
  enabled?: boolean;
  onAutoSelect?: (business: BusinessResponse) => void;
}

export const useBusinessesForClient = ({
  clientId,
  enabled = true,
  onAutoSelect,
}: UseBusinessesForClientOptions) => {
  const { data, isLoading } = useQuery({
    queryKey: clientId ? clientsQK.businessesAll(clientId) : ["clients", "businesses", "all", "none"],
    queryFn: () => clientsApi.listAllBusinessesForClient(clientId!),
    enabled: enabled && !!clientId,
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const businesses = useMemo(() => data?.items ?? [], [data?.items]);

  useEffect(() => {
    if (businesses.length === 1 && onAutoSelect) {
      onAutoSelect(businesses[0]);
    }
  }, [businesses, onAutoSelect]);

  return { businesses, isLoading };
};
