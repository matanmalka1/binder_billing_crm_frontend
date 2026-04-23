import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSeasonDashboard } from "./useSeasonDashboard";
import { CURRENT_YEAR } from "../types";
import type { AnnualReportsFilters } from "../components/shared/AnnualReportsFiltersBar";

const DEFAULT_FILTERS: AnnualReportsFilters = {
  client_id: "",
  client_name: "",
  status: "",
  year: "",
};

export const useAnnualReportsKanbanPage = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [filters, setFilters] = useState<AnnualReportsFilters>(DEFAULT_FILTERS);
  const navigate = useNavigate();

  const taxYear = filters.year ? Number(filters.year) : CURRENT_YEAR;
  const season = useSeasonDashboard(taxYear);

  const openReport = (id: number) => navigate(`/tax/reports/${id}`);

  const handleFilterChange = (key: keyof AnnualReportsFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => setFilters(DEFAULT_FILTERS);

  const filteredReports = useMemo(() => {
    let reports = season.reports;
    if (filters.client_id) {
      reports = reports.filter((r) => r.client_record_id === Number(filters.client_id));
    }
    if (filters.status) {
      reports = reports.filter((r) => r.status === filters.status);
    }
    return reports;
  }, [season.reports, filters.client_id, filters.status]);

  return {
    taxYear,
    showCreate,
    openCreate: () => setShowCreate(true),
    closeCreate: () => setShowCreate(false),
    openReport,
    filters,
    handleFilterChange,
    handleResetFilters,
    filteredReports,
    season,
  };
};
