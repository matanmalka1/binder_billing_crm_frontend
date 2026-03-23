import { useQuery } from "@tanstack/react-query";
import { vatReportsApi } from "../api";
import { QK } from "../../../lib/queryKeys";

export const useVatWorkItemPage = (workItemId: number) => {
  const workItemQuery = useQuery({
    queryKey: QK.tax.vatWorkItems.detail(workItemId),
    queryFn: () => vatReportsApi.getById(workItemId),
    enabled: workItemId > 0,
  });

  const invoicesQuery = useQuery({
    queryKey: QK.tax.vatWorkItems.invoices(workItemId),
    queryFn: () => vatReportsApi.listInvoices(workItemId),
    enabled: workItemId > 0,
  });

  const auditQuery = useQuery({
    queryKey: QK.tax.vatWorkItems.audit(workItemId),
    queryFn: () => vatReportsApi.getAuditTrail(workItemId),
    enabled: workItemId > 0,
  });

  return {
    workItem: workItemQuery.data ?? null,
    invoices: invoicesQuery.data?.items ?? [],
    auditTrail: auditQuery.data?.items ?? [],
    isLoading: workItemQuery.isPending,
    isError: workItemQuery.isError,
    refetch: workItemQuery.refetch,
  };
};
