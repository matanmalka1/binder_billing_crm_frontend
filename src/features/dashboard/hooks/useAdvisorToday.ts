import { useQuery } from "@tanstack/react-query";
import { taxDeadlinesApi } from "../../../api/taxDeadlines.api";
import { annualReportsApi } from "../../../api/annualReports.api";
import { remindersApi } from "../../../api/reminders.api";
import { chargesApi } from "../../../api/charges.api";
import { QK } from "../../../lib/queryKeys";
import { useRole } from "../../../hooks/useRole";

const sevenDaysFromNow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split("T")[0];
};

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const useAdvisorToday = () => {
  const { isAdvisor } = useRole();
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
      annualReportsApi.listAnnualReports({ page: 1, page_size: 100 }),
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
    queryKey: QK.charges.list({
      status: "issued",
      issued_before: daysAgo(60),
      page_size: 20,
    }),
    queryFn: () =>
      chargesApi.list({
        status: "issued",
        issued_before: daysAgo(60),
        page: 1,
        page_size: 20,
      }),
    staleTime: 5 * 60 * 1000,
  });

  const today = new Date().toISOString().split("T")[0];
  const weekEnd = sevenDaysFromNow();
  const fourteenDaysAgo = daysAgo(14);
  const sevenDaysAgo = daysAgo(7);
  const sixtyDaysAgo = daysAgo(60);

  const upcomingDeadlines = (deadlinesQuery.data?.items ?? []).filter(
    (d) => d.due_date >= today && d.due_date <= weekEnd,
  );

  const stuckReports = (reportsQuery.data?.items ?? []).filter(
    (r) => r.created_at <= fourteenDaysAgo && r.stage !== "transmitted",
  );

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
