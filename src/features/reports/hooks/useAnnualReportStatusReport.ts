import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportsApi, reportsQK } from "../api";
import { getErrorMessage } from "../../../utils/utils";

export const useAnnualReportStatusReport = () => {
  const currentYear = new Date().getFullYear();
  const [taxYear, setTaxYear] = useState<number>(currentYear);

  const query = useQuery({
    queryKey: reportsQK.annualReportStatus(taxYear),
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
