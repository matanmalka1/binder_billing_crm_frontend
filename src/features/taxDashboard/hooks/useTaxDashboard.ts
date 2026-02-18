import { useQuery } from "@tanstack/react-query";
import { taxDashboardApi } from "../../../api/taxDashboard.api";
import { taxDeadlinesApi } from "../../../api/taxDeadlines.api";
import { QK } from "../../../lib/queryKeys";

export const useTaxDashboard = () => {
  const currentYear = new Date().getFullYear();

  const submissionsQuery = useQuery({
    queryKey: QK.taxDashboard.submissions(currentYear),
    queryFn: () => taxDashboardApi.getTaxSubmissionsWidget(currentYear),
  });

  const deadlinesQuery = useQuery({
    queryKey: QK.taxDashboard.urgentDeadlines,
    queryFn: () => taxDeadlinesApi.getDashboardDeadlines(),
  });

  return {
    currentYear,
    submissionsQuery,
    deadlinesQuery,
    isLoading: submissionsQuery.isPending || deadlinesQuery.isPending,
    hasError: submissionsQuery.error || deadlinesQuery.error,
  };
};
