import { useQueries } from "@tanstack/react-query";
import type { SeasonSummary } from "../../../api/annualReport.api";
import { annualReportSeasonApi } from "../../../api/annualReport.season.api";
import { QK } from "../../../lib/queryKeys";

export interface YearComparisonData {
  year: number;
  season: SeasonSummary | null;
  isLoading: boolean;
  error: boolean;
}

export const useYearComparison = (years: number[]) => {
  const seasonQueries = useQueries({
    queries: years.map((year) => ({
      queryKey: QK.tax.annualReports.seasonSummary(year),
      queryFn: () => annualReportSeasonApi.getSeasonSummary(year),
      retry: 1,
    })),
  });

  const data: YearComparisonData[] = years.map((year, i) => ({
    year,
    season: seasonQueries[i].data ?? null,
    isLoading: seasonQueries[i].isPending,
    error: !!seasonQueries[i].error,
  }));

  const isLoading = seasonQueries.some((q) => q.isPending);

  return { data, isLoading };
};
