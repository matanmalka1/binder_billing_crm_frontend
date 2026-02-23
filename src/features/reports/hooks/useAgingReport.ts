// src/features/reports/hooks/useAgingReport.ts
import { useState } from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { reportsApi, type ExportFormat } from "../../../api/reports.api";
import { getErrorMessage, showErrorToast } from "../../../utils/utils";
import { QK } from "../../../lib/queryKeys";
import { toast } from "../../../utils/toast";

export const useAgingReport = () => {
  const [asOfDate, setAsOfDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  const reportQuery = useQuery({
    queryKey: QK.reports.aging(asOfDate),
    queryFn: () => reportsApi.getAgingReport(asOfDate),
  });

  const handleExport = async (format: ExportFormat) => {
    setExporting(format);
    try {
      const result = await reportsApi.exportAgingReport(format, asOfDate);
      toast.success(`דוח יוצא בהצלחה: ${result.filename}`);
    } catch (error) {
      showErrorToast(error, "שגיאה בייצוא דוח");
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
