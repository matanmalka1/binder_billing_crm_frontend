import { api } from "./client";
import { ENDPOINTS } from "./endpoints";

// ── Types ─────────────────────────────────────────────────────────────────

export type AnnualReportStatus =
  | "not_started"
  | "collecting_docs"
  | "docs_complete"
  | "in_preparation"
  | "pending_client"
  | "submitted"
  | "accepted"
  | "assessment_issued"
  | "objection_filed"
  | "closed";

export type ClientTypeForReport =
  | "individual"
  | "self_employed"
  | "corporation"
  | "partnership";

export type DeadlineType = "standard" | "extended" | "custom";

export type AnnualReportScheduleKey =
  | "schedule_b"
  | "schedule_bet"
  | "schedule_gimmel"
  | "schedule_dalet"
  | "schedule_heh";

export interface AnnualReportFull {
  id: number;
  client_id: number;
  tax_year: number;
  client_type: ClientTypeForReport;
  form_type: string;
  status: AnnualReportStatus;
  deadline_type: DeadlineType;
  filing_deadline: string | null;
  custom_deadline_note: string | null;
  submitted_at: string | null;
  ita_reference: string | null;
  assessment_amount: number | null;
  refund_due: number | null;
  tax_due: number | null;
  has_rental_income: boolean;
  has_capital_gains: boolean;
  has_foreign_income: boolean;
  has_depreciation: boolean;
  has_exempt_rental: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  assigned_to: number | null;
  created_by: number;
  schedules?: ScheduleEntry[];
  status_history?: StatusHistoryEntry[];
  // detail sub-entity
  tax_refund_amount?: number | null;
  tax_due_amount?: number | null;
  client_approved_at?: string | null;
  internal_notes?: string | null;
}

export interface ScheduleEntry {
  id: number;
  annual_report_id: number;
  schedule: AnnualReportScheduleKey;
  is_required: boolean;
  is_complete: boolean;
  notes: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface StatusHistoryEntry {
  id: number;
  annual_report_id: number;
  from_status: AnnualReportStatus | null;
  to_status: AnnualReportStatus;
  changed_by: number;
  changed_by_name: string;
  note: string | null;
  occurred_at: string;
}

export interface SeasonSummary {
  tax_year: number;
  total: number;
  not_started: number;
  collecting_docs: number;
  docs_complete: number;
  in_preparation: number;
  pending_client: number;
  submitted: number;
  accepted: number;
  assessment_issued: number;
  objection_filed: number;
  closed: number;
  completion_rate: number;
  overdue_count: number;
}

export interface AnnualReportListResponse {
  items: AnnualReportFull[];
  page: number;
  page_size: number;
  total: number;
}

export type StageKey =
  | "material_collection"
  | "in_progress"
  | "final_review"
  | "client_signature"
  | "transmitted";

export interface KanbanStage {
  stage: StageKey;
  reports: Array<{
    id: number;
    client_id: number;
    client_name: string;
    tax_year: number;
    days_until_due: number | null;
  }>;
}

export interface CreateAnnualReportPayload {
  client_id: number;
  tax_year: number;
  client_type: ClientTypeForReport;
  deadline_type?: DeadlineType;
  assigned_to?: number | null;
  notes?: string | null;
  has_rental_income?: boolean;
  has_capital_gains?: boolean;
  has_foreign_income?: boolean;
  has_depreciation?: boolean;
  has_exempt_rental?: boolean;
}

export interface StatusTransitionPayload {
  status: AnnualReportStatus;
  note?: string | null;
  ita_reference?: string | null;
  assessment_amount?: number | null;
  refund_due?: number | null;
  tax_due?: number | null;
}

// ── API ────────────────────────────────────────────────────────────────────

export const annualReportsExtendedApi = {
  createReport: async (payload: CreateAnnualReportPayload): Promise<AnnualReportFull> => {
    const res = await api.post<AnnualReportFull>("/annual-reports", payload);
    return res.data;
  },

  getReport: async (reportId: number): Promise<AnnualReportFull> => {
    const res = await api.get<AnnualReportFull>(`/annual-reports/${reportId}`);
    return res.data;
  },

  listReports: async (params: {
    tax_year?: number;
    page?: number;
    page_size?: number;
  }): Promise<AnnualReportListResponse> => {
    const res = await api.get<AnnualReportListResponse>("/annual-reports", { params });
    return res.data;
  },

  listClientReports: async (clientId: number): Promise<AnnualReportFull[]> => {
    const res = await api.get<AnnualReportFull[]>(`/clients/${clientId}/annual-reports`);
    return res.data;
  },

  getSeasonSummary: async (taxYear: number): Promise<SeasonSummary> => {
    const res = await api.get<SeasonSummary>(`/tax-year/${taxYear}/summary`);
    return res.data;
  },

  listSeasonReports: async (
    taxYear: number,
    params: { page?: number; page_size?: number }
  ): Promise<AnnualReportListResponse> => {
    const res = await api.get<AnnualReportListResponse>(`/tax-year/${taxYear}/reports`, { params });
    return res.data;
  },

  transitionStatus: async (
    reportId: number,
    payload: StatusTransitionPayload
  ): Promise<AnnualReportFull> => {
    const res = await api.post<AnnualReportFull>(`/annual-reports/${reportId}/status`, payload);
    return res.data;
  },

  submitReport: async (
    reportId: number,
    payload: { submitted_at?: string; ita_reference?: string | null; note?: string | null } = {}
  ): Promise<AnnualReportFull> => {
    const res = await api.post<AnnualReportFull>(`/annual-reports/${reportId}/submit`, payload);
    return res.data;
  },

  transitionStage: async (reportId: number, toStage: StageKey): Promise<AnnualReportFull> => {
    const res = await api.post<AnnualReportFull>(`/annual-reports/${reportId}/transition`, {
      to_stage: toStage,
    });
    return res.data;
  },

  updateDeadline: async (
    reportId: number,
    payload: { deadline_type: DeadlineType; custom_deadline_note?: string | null }
  ): Promise<AnnualReportFull> => {
    const res = await api.post<AnnualReportFull>(`/annual-reports/${reportId}/deadline`, payload);
    return res.data;
  },

  getSchedules: async (reportId: number): Promise<ScheduleEntry[]> => {
    const res = await api.get<ScheduleEntry[]>(`/annual-reports/${reportId}/schedules`);
    return res.data;
  },

  addSchedule: async (
    reportId: number,
    payload: { schedule: AnnualReportScheduleKey; notes?: string | null }
  ): Promise<ScheduleEntry> => {
    const res = await api.post<ScheduleEntry>(ENDPOINTS.annualReportAddSchedule(reportId), payload);
    return res.data;
  },

  completeSchedule: async (
    reportId: number,
    schedule: AnnualReportScheduleKey
  ): Promise<ScheduleEntry> => {
    const res = await api.post<ScheduleEntry>(`/annual-reports/${reportId}/schedules/complete`, {
      schedule,
    });
    return res.data;
  },

  getHistory: async (reportId: number): Promise<StatusHistoryEntry[]> => {
    const res = await api.get<StatusHistoryEntry[]>(`/annual-reports/${reportId}/history`);
    return res.data;
  },

  getOverdue: async (taxYear?: number): Promise<AnnualReportFull[]> => {
    const res = await api.get<AnnualReportFull[]>("/annual-reports/overdue", {
      params: taxYear ? { tax_year: taxYear } : undefined,
    });
    return res.data;
  },

  getKanbanView: async (): Promise<{ stages: KanbanStage[] }> => {
    const res = await api.get<{ stages: KanbanStage[] }>("/annual-reports/kanban/view");
    return res.data;
  },
};
