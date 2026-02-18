// src/features/reports/hooks/useAgingReport.ts
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportsApi, type ExportFormat } from "../../../api/reports.api";
import { getErrorMessage } from "../../../utils/utils";
import { toast } from "../../../utils/toast";
import { QK } from "../../../lib/queryKeys";

export const useAgingReport = () => {
  const [asOfDate, setAsOfDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  const reportQuery = useQuery({
    queryKey: QK.reports.aging(asOfDate),
    queryFn: () => reportsApi.getAgingReport(asOfDate),
  });

  const handleExport = async (format: ExportFormat) => {
    setExporting(format);
    try {
      const result = await reportsApi.exportAgingReport(format);
      toast.success(`דוח יוצא בהצלחה: ${result.filename}`);

      // Open download URL in new tab
      if (result.download_url) {
        window.open(result.download_url, "_blank");
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "שגיאה בייצוא דוח"));
    } finally {
      setExporting(null);
    }
  };

  return {
    asOfDate,
    setAsOfDate,
    exporting,
    reportQuery,
    handleExport,
    data: reportQuery.data,
    isLoading: reportQuery.isPending,
    error: reportQuery.error
      ? getErrorMessage(reportQuery.error, "שגיאה בטעינת הדוח")
      : null,
  };
};
