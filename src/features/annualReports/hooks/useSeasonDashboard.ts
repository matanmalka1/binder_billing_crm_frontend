import { useQuery } from "@tanstack/react-query";
import { annualReportsApi } from "../../../api/annualReports.api"
import { getErrorMessage } from "../../../utils/utils";
import { QK } from "../../../lib/queryKeys";

export const useSeasonDashboard = (taxYear: number) => {
  const summaryQuery = useQuery({
    queryKey: QK.tax.annualReports.seasonSummary(taxYear),
    queryFn: () => annualReportsApi.getSeasonSummary(taxYear),
  });

  const reportsQuery = useQuery({
    queryKey: QK.tax.annualReports.seasonList(taxYear),
    queryFn: () =>
      annualReportsApi.listSeasonReports(taxYear, { page: 1, page_size: 200 }),
  });

  const overdueQuery = useQuery({
    queryKey: QK.tax.annualReports.overdue(taxYear),
    queryFn: () => annualReportsApi.getOverdue(taxYear),
  });

  return {
    summary: summaryQuery.data ?? null,
    reports: reportsQuery.data?.items ?? [],
    overdue: overdueQuery.data ?? [],
    isLoading: summaryQuery.isPending || reportsQuery.isPending,
    error:
      summaryQuery.error
        ? getErrorMessage(summaryQuery.error, "שגיאה בטעינת סיכום עונה")
        : reportsQuery.error
        ? getErrorMessage(reportsQuery.error, "שגיאה בטעינת דוחות")
        : null,
  };
};
