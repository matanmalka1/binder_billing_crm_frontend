import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { annualReportsApi } from "../api";
import { QK } from "../../../lib/queryKeys";
import { getErrorMessage } from "../../../utils/utils";
import { CURRENT_YEAR } from "../types";

const YEAR_LIST = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2, CURRENT_YEAR - 3];

export const useClientAnnualReportsTab = (clientId: number) => {
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR);
  const navigate = useNavigate();

  const { data, isPending, error } = useQuery({
    queryKey: QK.tax.annualReportsForClient(clientId),
    queryFn: () => annualReportsApi.listClientReports(clientId),
  });

  const allReports = data ?? [];
  const filteredReports = allReports.filter((r) => r.tax_year === selectedYear);
  const yearHasReports = (year: number) => allReports.some((r) => r.tax_year === year);

  const openReport = (id: number) => navigate(`/tax/reports/${id}`);

  return {
    selectedYear,
    setSelectedYear,
    filteredReports,
    yearHasReports,
    openReport,
    isPending,
    errorMessage: error ? getErrorMessage(error, "שגיאה בטעינת דוחות שנתיים") : null,
    YEAR_LIST,
  };
};
