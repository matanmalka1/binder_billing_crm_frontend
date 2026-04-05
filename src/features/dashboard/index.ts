// Public surface of the dashboard feature
export { dashboardApi, dashboardQK } from "./api";
export { DASHBOARD_ENDPOINTS } from "./api/endpoints";
export { AdvisorTodayCard } from "./components/AdvisorTodayCard";
export { AttentionPanel } from "./components/AttentionPanel";
export { DashboardStatsGrid } from "./components/DashboardStatsGrid";
export { OperationalPanel } from "./components/OperationalPanel";
export { SeasonSummaryWidget } from "./components/SeasonSummaryWidget";
export { useDashboardPage } from "./hooks/useDashboardPage";
export { Dashboard } from "./pages/DashboardPage";
export type {
  DashboardOverviewResponse,
  DashboardSummaryResponse,
  AttentionItem,
  AttentionResponse,
} from "./api";
