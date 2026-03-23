import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "../api";
import { getErrorMessage } from "../../../utils/utils";
import { QK } from "../../../lib/queryKeys";

export const useAnnualReportStatusReport = () => {
  const currentYear = new Date().getFullYear();
  const [taxYear, setTaxYear] = useState<number>(currentYear);

  const query = useQuery({
    queryKey: QK.reports.annualReportStatus(taxYear),
    queryFn: () => reportsApi.getAnnualReportStatusReport(taxYear),
  });

  return {
    taxYear,
    setTaxYear,
    data: query.data,
    isLoading: query.isPending,
    error: query.error
      ? getErrorMessage(query.error, "שגיאה בטעינת הדוח")
      : null,
  };
};
