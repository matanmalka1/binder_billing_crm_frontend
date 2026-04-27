import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportsApi, reportsQK } from "../api";
import { getErrorMessage } from "../../../utils/utils";

export const useAnnualReportStatusReport = (controlledYear?: number) => {
  const [internalYear, setInternalYear] = useState<number>(new Date().getFullYear());
  const taxYear = controlledYear ?? internalYear;

  const query = useQuery({
    queryKey: reportsQK.annualReportStatus(taxYear),
    queryFn: () => reportsApi.getAnnualReportStatusReport(taxYear),
  });

  return {
    taxYear,
    setTaxYear: setInternalYear,
    data: query.data,
    isLoading: query.isPending,
    error: query.error
      ? getErrorMessage(query.error, "שגיאה בטעינת הדוח")
      : null,
  };
};
