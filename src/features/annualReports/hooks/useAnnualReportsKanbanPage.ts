import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnnualReportsKanban } from "./useAnnualReportsKanban";
import { useSeasonDashboard } from "./useSeasonDashboard";
import { CURRENT_YEAR, type ActiveTab } from "../types";

export const useAnnualReportsKanbanPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("kanban");
  const [taxYear, setTaxYear] = useState(CURRENT_YEAR);
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();

  const kanban = useAnnualReportsKanban(taxYear);
  const season = useSeasonDashboard(taxYear);

  const decrementYear = () => { setTaxYear((y) => y - 1); };
  const incrementYear = () => { setTaxYear((y) => Math.min(y + 1, CURRENT_YEAR)); };
  const canIncrementYear = taxYear < CURRENT_YEAR;

  const openReport = (id: number) => navigate(`/tax/reports/${id}`);

  return {
    activeTab,
    setActiveTab,
    taxYear,
    decrementYear,
    incrementYear,
    canIncrementYear,
    showCreate,
    openCreate: () => setShowCreate(true),
    closeCreate: () => setShowCreate(false),
    openReport,
    ...kanban,
    season,
  };
};