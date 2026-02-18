import { useQuery } from "@tanstack/react-query";
import { annualReportsExtendedApi } from "../../../api/annualReports.extended.api"
import { getErrorMessage } from "../../../utils/utils";

export const useSeasonDashboard = (taxYear: number) => {
  const summaryQuery = useQuery({
    queryKey: ["tax", "annual-reports", "season", taxYear, "summary"] as const,
    queryFn: () => annualReportsExtendedApi.getSeasonSummary(taxYear),
  });

  const reportsQuery = useQuery({
    queryKey: ["tax", "annual-reports", "season", taxYear, "list"] as const,
    queryFn: () =>
      annualReportsExtendedApi.listSeasonReports(taxYear, { page: 1, page_size: 200 }),
  });

  const overdueQuery = useQuery({
    queryKey: ["tax", "annual-reports", "overdue", taxYear] as const,
    queryFn: () => annualReportsExtendedApi.getOverdue(taxYear),
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
