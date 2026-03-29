import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { clientsApi } from "@/features/clients/api";
import type { BusinessResponse } from "@/features/clients/api";
import { QK } from "../lib/queryKeys";

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
    queryKey: clientId ? QK.clients.businesses(clientId) : ["clients", "businesses", "none"],
    queryFn: () => clientsApi.listBusinessesForClient(clientId!),
    enabled: enabled && !!clientId,
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const businesses = data?.items ?? [];

  useEffect(() => {
    if (businesses.length === 1 && onAutoSelect) {
      onAutoSelect(businesses[0]);
    }
  }, [businesses.length, businesses[0]?.id]);

  return { businesses, isLoading };
};
