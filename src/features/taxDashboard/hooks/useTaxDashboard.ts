import { useQuery } from "@tanstack/react-query";
import { taxDashboardApi } from "../../../api/taxDashboard.api";
import { taxDeadlinesApi } from "../../../api/taxDeadlines.api";

export const useTaxDashboard = () => {
  const currentYear = new Date().getFullYear();

  const submissionsQuery = useQuery({
    queryKey: ["tax", "submissions", currentYear] as const,
    queryFn: () => taxDashboardApi.getTaxSubmissionsWidget(currentYear),
  });

  const deadlinesQuery = useQuery({
    queryKey: ["tax", "deadlines", "urgent"] as const,
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
