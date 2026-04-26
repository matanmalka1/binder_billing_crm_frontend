import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { vatReportsApi } from "../api";
import { vatReportsQK } from "../api/queryKeys";

export const useVatHistory = (workItemId: number) => {
  const query = useQuery({
    queryKey: vatReportsQK.audit(workItemId),
    queryFn: () => vatReportsApi.getAuditTrail(workItemId),
  });

  const items = useMemo(
    () => [...(query.data?.items ?? [])].reverse(),
    [query.data?.items],
  );

  return {
    ...query,
    items,
  };
};
