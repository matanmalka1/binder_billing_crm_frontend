// DEPRECATED: use annualReports.extended.api.ts instead.
// Temporary shim that delegates to the canonical extended API to avoid drift.
// Safe to delete once all imports are updated (callers already migrated).
import {
  annualReportsExtendedApi,
  type AnnualReportFull as AnnualReportResponse,
  type AnnualReportListResponse,
  type KanbanStage,
  type StageKey,
} from "./annualReports.extended.api";

export type { AnnualReportResponse, AnnualReportListResponse, KanbanStage, StageKey };

export const annualReportsApi = {
  createAnnualReport: annualReportsExtendedApi.createReport,
  listAnnualReports: annualReportsExtendedApi.listReports,
  getAnnualReport: annualReportsExtendedApi.getReport,
  submitAnnualReport: (reportId: number) =>
    annualReportsExtendedApi.submitReport(reportId, { submitted_at: new Date().toISOString() }),
  transitionAnnualReport: (reportId: number, toStage: StageKey) =>
    annualReportsExtendedApi.transitionStage(reportId, toStage),
  getKanbanView: annualReportsExtendedApi.getKanbanView,
};
