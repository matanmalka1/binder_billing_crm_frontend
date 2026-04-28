import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getYear } from "date-fns";
import { annualReportSeasonApi, annualReportsQK } from "@/features/annualReports";
import { buildSeasonSummaryStats } from "../seasonSummaryHelpers";

export const useSeasonSummary = () => {
  const currentYear = useMemo(() => getYear(new Date()), []);

  const { data, isPending } = useQuery({
    queryKey: annualReportsQK.seasonSummary(currentYear),
    queryFn: () => annualReportSeasonApi.getSeasonSummary(currentYear),
  });

  const stats = useMemo(() => {
    if (!data) return null;
    return buildSeasonSummaryStats(data, currentYear);
  }, [data, currentYear]);

  return { stats, isPending };
};
