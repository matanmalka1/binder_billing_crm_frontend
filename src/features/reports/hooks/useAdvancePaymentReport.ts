import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QK } from "../../../lib/queryKeys";
import { reportsApi } from "../../../api/reports.api";

export function useAdvancePaymentReport() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState<number | undefined>(undefined);

  const { data, isLoading, error } = useQuery({
    queryKey: QK.reports.advancePayments(year, month),
    queryFn: () => reportsApi.getAdvancePaymentReport(year, month),
  });

  return { year, setYear, month, setMonth, data, isLoading, error };
}
