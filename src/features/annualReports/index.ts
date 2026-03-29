// Public surface of the annualReports feature — only import from this barrel externally
export {
  annualReportsApi,
  annualReportFinancialsApi,
  annualReportStatusApi,
  annualReportTaxApi,
  annualReportSeasonApi,
  annualReportsQK,
  getStatusLabel,
  getStatusVariant,
  getAllowedTransitions,
  getClientTypeLabel,
  getScheduleLabel,
  getReportStageLabel,
  getReportStatusLabel,
  getStageColor,
  SEASON_PROGRESS_STAGES,
} from "./api";
export { AnnualReportColumn } from "./components/kanban/AnnualReportColumn";
export { SeasonProgressBar } from "./components/kanban/SeasonProgressBar";
export { SeasonReportsTable } from "./components/kanban/SeasonReportsTable";
export { SeasonSummaryCards } from "./components/kanban/SeasonSummaryCards";
export { YearComparisonModal } from "./components/kanban/YearComparisonModal";
export { AnnualReportFullPanel } from "./components/panel/AnnualReportFullPanel";
export { ClientAnnualReportsTab } from "./components/shared/ClientAnnualReportsTab";
export { CreateReportModal } from "./components/shared/CreateReportModal";
export { OverdueBanner } from "./components/shared/OverdueBanner";
export { useAnnualReportsKanbanPage } from "./hooks/useAnnualReportsKanbanPage";
export { AnnualReportDetail } from "./pages/AnnualReportDetailPage";
export { AnnualReportsKanban } from "./pages/AnnualReportsKanbanPage";
export {
  KANBAN_PAGE_SIZE,
  STAGE_ORDER,
  TAB_LABELS,
} from "./types";
export type {
  AnnualReportFull,
  AnnualReportStatus,
  AnnualReportScheduleKey,
  ClientTypeForReport,
  ReportDetailResponse,
} from "./api";
export type { ActiveTab } from "./types";
