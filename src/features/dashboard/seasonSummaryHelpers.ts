import type { annualReportSeasonApi } from "@/features/annualReports";

type SeasonSummaryData = Awaited<ReturnType<typeof annualReportSeasonApi.getSeasonSummary>>;

const getProgressColor = (completionPct: number) => {
  if (completionPct >= 75) return "bg-positive-500";
  if (completionPct >= 40) return "bg-info-500";
  return "bg-warning-500";
};

export const buildSeasonSummaryStats = (data: SeasonSummaryData, currentYear: number) => {
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
