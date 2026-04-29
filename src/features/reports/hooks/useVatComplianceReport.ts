import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportsApi, reportsQK } from "../api";

export const useVatComplianceReport = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  const { data, isLoading, error } = useQuery({
    queryKey: reportsQK.vatCompliance(year),
    queryFn: () => reportsApi.getVatComplianceReport(year),
  });

  return { year, setYear, data, isLoading, error };
};
