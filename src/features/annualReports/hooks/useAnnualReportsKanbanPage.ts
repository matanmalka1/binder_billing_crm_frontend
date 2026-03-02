import { useState } from "react";
import { useAnnualReportsKanban } from "./useAnnualReportsKanban";
import { useSeasonDashboard } from "./useSeasonDashboard";
import { CURRENT_YEAR, type ActiveTab } from "../types";

export const useAnnualReportsKanbanPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("kanban");
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [taxYear, setTaxYear] = useState(CURRENT_YEAR - 1);
  const [showCreate, setShowCreate] = useState(false);

  const kanban = useAnnualReportsKanban();
  const season = useSeasonDashboard(taxYear);

  const decrementYear = () => setTaxYear((y) => y - 1);
  const incrementYear = () => setTaxYear((y) => Math.min(y + 1, CURRENT_YEAR));
  const canIncrementYear = taxYear < CURRENT_YEAR - 1;

  return {
    activeTab,
    setActiveTab,
    selectedReportId,
    setSelectedReportId,
    taxYear,
    decrementYear,
    incrementYear,
    canIncrementYear,
    showCreate,
    openCreate: () => setShowCreate(true),
    closeCreate: () => setShowCreate(false),
    ...kanban,
    season,
  };
};
