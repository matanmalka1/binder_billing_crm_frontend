import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getYear } from "date-fns";
import { annualReportSeasonApi, annualReportsQK } from "@/features/annualReports";

export const useSeasonSummary = () => {
  const currentYear = useMemo(() => getYear(new Date()), []);

  const { data, isPending } = useQuery({
    queryKey: annualReportsQK.seasonSummary(currentYear),
    queryFn: () => annualReportSeasonApi.getSeasonSummary(currentYear),
  });

  const stats = useMemo(() => {
    if (!data) return null;

    const completionPct = Math.round(data.completion_rate);
    const done = data.submitted + data.accepted + data.closed;
    const inProgress = data.total - data.not_started - done;

    return {
      total: data.total,
      notStarted: data.not_started,
      submitted: data.submitted,
      closed: data.closed,
      overdueCount: data.overdue_count,
      done,
      inProgress,
      completionPct,
      hasOverdue: data.overdue_count > 0,
      currentYear,
      progressColor: 
        completionPct >= 75 ? "bg-positive-500" : 
        completionPct >= 40 ? "bg-info-500" : 
        "bg-warning-500",
    };
  }, [data, currentYear]);

  return { stats, isPending };
};