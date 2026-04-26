import { useQuery } from "@tanstack/react-query";
import { vatReportsApi } from "../api";
import { vatReportsQK } from "../api/queryKeys";
import { useVatWorkItemDetail } from "./useVatWorkItemDetail";

export const useVatWorkItemPage = (workItemId: number) => {
  const workItemQuery = useQuery({
    queryKey: vatReportsQK.detail(workItemId),
    queryFn: () => vatReportsApi.getById(workItemId),
    enabled: workItemId > 0,
  });

  const invoicesQuery = useQuery({
    queryKey: vatReportsQK.invoices(workItemId),
    queryFn: () => vatReportsApi.listInvoices(workItemId),
    enabled: workItemId > 0,
  });

  const auditQuery = useQuery({
    queryKey: vatReportsQK.audit(workItemId),
    queryFn: () => vatReportsApi.getAuditTrail(workItemId),
    enabled: workItemId > 0,
  });
  const invoices = invoicesQuery.data?.items ?? [];
  const { summary } = useVatWorkItemDetail(workItemId, invoices);

  return {
    workItem: workItemQuery.data ?? null,
    invoices,
    summary,
    auditTrail: auditQuery.data?.items ?? [],
    isLoading: workItemQuery.isPending,
    isError: workItemQuery.isError,
    refetch: workItemQuery.refetch,
  };
};
