export const formatAnnualReportDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("he-IL");
};
