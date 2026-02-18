import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { taxDeadlinesApi } from "../../../api/taxDeadlines.api";
import { annualReportsExtendedApi } from "../../../api/annualReports.extended.api";
import { remindersApi } from "../../../api/reminders.api";
import { chargesApi } from "../../../api/charges.api";
import { QK } from "../../../lib/queryKeys";
import { useRole } from "../../../hooks/useRole";

// Compute once per calendar day — stable across re-renders within the same day
const getDateAnchors = () => {
  const now = new Date();

  const offsetDate = (days: number, iso = false) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return iso ? d.toISOString() : d.toISOString().split("T")[0];
  };

  return {
    today: offsetDate(0),
    weekEnd: offsetDate(7),
    sevenDaysAgo: offsetDate(-7, true),
    fourteenDaysAgo: offsetDate(-14, true),
    sixtyDaysAgo: offsetDate(-60, true),
  };
};

export const useAdvisorToday = () => {
  const { isAdvisor } = useRole();

  // Stable date anchors — only recomputed if the component remounts on a new day
  const { today, weekEnd, sevenDaysAgo, fourteenDaysAgo, sixtyDaysAgo } =
    useMemo(getDateAnchors, []);

  const deadlinesQuery = useQuery({
    enabled: isAdvisor,
    queryKey: QK.advisorToday.deadlines,
    queryFn: () =>
      taxDeadlinesApi.listTaxDeadlines({
        status: "pending",
        page: 1,
        page_size: 50,
      }),
    staleTime: 5 * 60 * 1000,
  });

  const reportsQuery = useQuery({
    enabled: isAdvisor,
    queryKey: QK.advisorToday.reports,
    queryFn: () =>
      annualReportsExtendedApi.listReports({ page: 1, page_size: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  const remindersQuery = useQuery({
    enabled: isAdvisor,
    queryKey: QK.advisorToday.reminders,
    queryFn: () => remindersApi.list({ status: "pending", page_size: 50 }),
    staleTime: 5 * 60 * 1000,
  });

  const chargesQuery = useQuery({
    enabled: isAdvisor,
    // sixtyDaysAgo is now stable — same string reference across re-renders
    queryKey: QK.charges.list({
      status: "issued",
      issued_before: sixtyDaysAgo,
      page_size: 20,
    }),
    queryFn: () =>
      chargesApi.list({
        status: "issued",
        issued_before: sixtyDaysAgo,
        page: 1,
        page_size: 20,
      }),
    staleTime: 5 * 60 * 1000,
  });

  const upcomingDeadlines = (deadlinesQuery.data?.items ?? []).filter(
    (d) => d.due_date >= today && d.due_date <= weekEnd,
  );

  const stuckReports = (reportsQuery.data?.items ?? []).filter((r) => {
    const stale = r.created_at <= fourteenDaysAgo;
    const doneStatuses = ["submitted", "accepted", "assessment_issued", "closed"];
    return stale && !doneStatuses.includes(r.status);
  });

  const pendingReminders = (remindersQuery.data?.items ?? []).filter(
    (r) => r.created_at <= sevenDaysAgo,
  );

  const openCharges = (chargesQuery.data?.items ?? []).filter(
    (c) => c.issued_at !== null && c.issued_at! <= sixtyDaysAgo,
  );

  const isLoading =
    isAdvisor &&
    (deadlinesQuery.isPending ||
      reportsQuery.isPending ||
      remindersQuery.isPending ||
      chargesQuery.isPending);

  return {
    isLoading,
    upcomingDeadlines,
    stuckReports,
    pendingReminders,
    openCharges,
  };
};
