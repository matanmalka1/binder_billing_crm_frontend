import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getYear } from "date-fns";
import { annualReportSeasonApi, annualReportsQK } from "@/features/annualReports";
import type { annualReportSeasonApi as SeasonApiType } from "@/features/annualReports";

type SeasonSummaryData = Awaited<ReturnType<typeof SeasonApiType.getSeasonSummary>>;

const getProgressColor = (pct: number) => {
  if (pct >= 75) return "bg-positive-500";
  if (pct >= 40) return "bg-info-500";
  return "bg-warning-500";
};

const buildStats = (data: SeasonSummaryData, currentYear: number) => {
  const completionPct = Math.round(data.completion_rate);
  const done = data.submitted + data.accepted + data.closed;
  return {
    total: data.total,
    notStarted: data.not_started,
    submitted: data.submitted,
    closed: data.closed,
    overdueCount: data.overdue_count,
    done,
    inProgress: data.total - data.not_started - done,
    completionPct,
    hasOverdue: data.overdue_count > 0,
    currentYear,
    progressColor: getProgressColor(completionPct),
  };
};

export const useSeasonSummary = () => {
  const currentYear = useMemo(() => getYear(new Date()), []);

  const { data, isPending } = useQuery({
    queryKey: annualReportsQK.seasonSummary(currentYear),
    queryFn: () => annualReportSeasonApi.getSeasonSummary(currentYear),
  });

  const stats = useMemo(() => (data ? buildStats(data, currentYear) : null), [data, currentYear]);

  return { stats, isPending };
};
