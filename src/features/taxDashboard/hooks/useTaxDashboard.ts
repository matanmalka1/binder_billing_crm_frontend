import { useQuery } from "@tanstack/react-query";
import { getYear } from "date-fns";
import { taxDashboardApi } from "../../../api/taxDashboard.api";
import { taxDeadlinesApi } from "../../../api/taxDeadlines.api";
import type { TaxSubmissionWidgetResponse } from "../../../api/taxDashboard.api";
import type { DeadlineUrgentItem, TaxDeadlineResponse } from "../../../api/taxDeadlines.api";
import { QK } from "../../../lib/queryKeys";

export interface TaxDashboardData {
  currentYear: number;
  submissions: TaxSubmissionWidgetResponse | undefined;
  urgentDeadlines: DeadlineUrgentItem[];
  upcomingDeadlines: TaxDeadlineResponse[];
  isLoading: boolean;
  hasError: boolean;
}

export const useTaxDashboard = (): TaxDashboardData => {
  const currentYear = getYear(new Date());

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
    submissions: submissionsQuery.data,
    urgentDeadlines: deadlinesQuery.data?.urgent ?? [],
    upcomingDeadlines: deadlinesQuery.data?.upcoming ?? [],
    isLoading: submissionsQuery.isPending || deadlinesQuery.isPending,
    hasError: Boolean(submissionsQuery.error || deadlinesQuery.error),
  };
};