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
  | "closed"
  | "amended";

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
  client_name?: string | null;
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
  tax_refund_amount?: number | null;
  tax_due_amount?: number | null;
  client_approved_at?: string | null;
  internal_notes?: string | null;
  amendment_reason?: string | null;
  profit?: number | null;
  final_balance?: number | null;
  available_actions?: {
    id: string;
    key: string;
    label: string;
    method: string;
    endpoint: string;
    payload?: Record<string, unknown>;
    confirm?: {
      title: string;
      message: string;
      confirm_label: string;
      cancel_label: string;
    };
  }[];
  // Financial summary fields (present in detail response)
  total_income?: number;
  total_expenses?: number;
  taxable_income?: number;
}

export interface ReportDetailResponse {
  report_id: number;
  tax_refund_amount: number | null;
  tax_due_amount: number | null;
  client_approved_at: string | null;
  internal_notes: string | null;
  credit_points: number | null;
  pension_credit_points: number | null;
  life_insurance_credit_points: number | null;
  tuition_credit_points: number | null;
  pension_contribution: number | null;
  donation_amount: number | null;
  other_credits: number | null;
  created_at: string | null;
  updated_at: string | null;
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
  filing_date?: string | null;
  status?: string;
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

export type IncomeSourceType =
  | "business"
  | "salary"
  | "interest"
  | "dividends"
  | "capital_gains"
  | "rental"
  | "foreign"
  | "pension"
  | "other";

export type ExpenseCategoryType =
  | "office_rent"
  | "professional_services"
  | "salaries"
  | "depreciation"
  | "vehicle"
  | "marketing"
  | "insurance"
  | "communication"
  | "travel"
  | "training"
  | "bank_fees"
  | "other";

export interface IncomeLineResponse {
  id: number;
  annual_report_id: number;
  source_type: IncomeSourceType;
  amount: number;
  description: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface ExpenseLineResponse {
  id: number;
  annual_report_id: number;
  category: ExpenseCategoryType;
  amount: number;
  recognition_rate: number;
  recognized_amount: number;
  supporting_document_ref: string | null;
  supporting_document_id: number | null;
  supporting_document_filename: string | null;
  description: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface FinancialSummaryResponse {
  annual_report_id: number;
  total_income: number;
  gross_expenses: number;
  recognized_expenses: number;
  taxable_income: number;
  income_lines: IncomeLineResponse[];
  expense_lines: ExpenseLineResponse[];
}

export interface ReadinessCheckResponse {
  annual_report_id: number;
  is_ready: boolean;
  issues: string[];
  completion_pct: number; // 0.0–100.0
}

export interface BracketBreakdownItem {
  rate: number;
  from_amount: number;
  to_amount: number | null;
  taxable_in_bracket: number;
  tax_in_bracket: number;
}

export interface NationalInsuranceBreakdown {
  base_amount: number;
  high_amount: number;
  total: number;
}

export interface TaxCalculationResult {
  taxable_income: number;
  pension_deduction: number;
  tax_before_credits: number;
  credit_points_value: number;
  donation_credit: number;
  other_credits: number;
  tax_after_credits: number;
  net_profit: number;
  effective_rate: number;
  national_insurance: NationalInsuranceBreakdown;
  brackets: BracketBreakdownItem[];
  total_liability: number | null;
}

export interface AnnexDataLine {
  id: number;
  annual_report_id: number;
  schedule: AnnualReportScheduleKey;
  line_number: number;
  data: Record<string, unknown>;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface AnnexDataAddPayload {
  data: Record<string, unknown>;
  notes?: string | null;
}

export interface AdvancesSummary {
  total_advances_paid: number;
  advances_count: number;
  final_balance: number;
  balance_type: "due" | "refund" | "zero";
}

export interface IncomeLinePayload {
  source_type: IncomeSourceType;
  amount: number;
  description?: string | null;
}

export interface ExpenseLinePayload {
  category: ExpenseCategoryType;
  amount: number;
  description?: string | null;
  recognition_rate?: number | null;
  supporting_document_ref?: string | null;
  supporting_document_id?: number | null;
}

// ── API ────────────────────────────────────────────────────────────────────

export const annualReportsApi = {
  createReport: async (payload: CreateAnnualReportPayload): Promise<AnnualReportFull> => {
    const res = await api.post<AnnualReportFull>(ENDPOINTS.annualReports, payload);
    return res.data;
  },

  getReport: async (reportId: number): Promise<AnnualReportFull> => {
    const res = await api.get<AnnualReportFull>(ENDPOINTS.annualReportById(reportId));
    return res.data;
  },

  listReports: async (params: {
    tax_year?: number;
    page?: number;
    page_size?: number;
  }): Promise<AnnualReportListResponse> => {
    const res = await api.get<AnnualReportListResponse>(ENDPOINTS.annualReports, { params });
    return res.data;
  },

  listClientReports: async (clientId: number): Promise<AnnualReportFull[]> => {
    const res = await api.get<AnnualReportFull[]>(ENDPOINTS.clientAnnualReports(clientId));
    return res.data;
  },

  getSchedules: async (reportId: number): Promise<ScheduleEntry[]> => {
    const res = await api.get<ScheduleEntry[]>(ENDPOINTS.annualReportSchedules(reportId));
    return res.data;
  },

  addSchedule: async (
    reportId: number,
    payload: { schedule: AnnualReportScheduleKey; notes?: string | null }
  ): Promise<ScheduleEntry> => {
    const res = await api.post<ScheduleEntry>(ENDPOINTS.annualReportSchedules(reportId), payload);
    return res.data;
  },

  completeSchedule: async (
    reportId: number,
    schedule: AnnualReportScheduleKey
  ): Promise<ScheduleEntry> => {
    const res = await api.post<ScheduleEntry>(ENDPOINTS.annualReportSchedulesComplete(reportId), {
      schedule,
    });
    return res.data;
  },

  getHistory: async (reportId: number): Promise<StatusHistoryEntry[]> => {
    const res = await api.get<StatusHistoryEntry[]>(ENDPOINTS.annualReportHistory(reportId));
    return res.data;
  },

  getReportDetails: async (reportId: number): Promise<ReportDetailResponse> => {
    const res = await api.get<ReportDetailResponse>(ENDPOINTS.annualReportDetails(reportId));
    return res.data;
  },

  patchReportDetails: async (
    reportId: number,
    payload: Partial<ReportDetailResponse>
  ): Promise<ReportDetailResponse> => {
    const res = await api.patch<ReportDetailResponse>(
      ENDPOINTS.annualReportDetails(reportId),
      payload,
    );
    return res.data;
  },

  deleteReport: async (reportId: number): Promise<void> => {
    await api.delete(ENDPOINTS.annualReportById(reportId));
  },

  getAnnexLines: async (reportId: number, schedule: AnnualReportScheduleKey): Promise<AnnexDataLine[]> => {
    const res = await api.get<AnnexDataLine[]>(ENDPOINTS.annualReportAnnex(reportId, schedule));
    return res.data;
  },

  addAnnexLine: async (
    reportId: number,
    schedule: AnnualReportScheduleKey,
    payload: AnnexDataAddPayload
  ): Promise<AnnexDataLine> => {
    const res = await api.post<AnnexDataLine>(ENDPOINTS.annualReportAnnex(reportId, schedule), payload);
    return res.data;
  },

  updateAnnexLine: async (
    reportId: number,
    schedule: AnnualReportScheduleKey,
    lineId: number,
    payload: AnnexDataAddPayload
  ): Promise<AnnexDataLine> => {
    const res = await api.patch<AnnexDataLine>(
      ENDPOINTS.annualReportAnnexLine(reportId, schedule, lineId),
      payload
    );
    return res.data;
  },

  deleteAnnexLine: async (
    reportId: number,
    schedule: AnnualReportScheduleKey,
    lineId: number
  ): Promise<void> => {
    await api.delete(ENDPOINTS.annualReportAnnexLine(reportId, schedule, lineId));
  },

  amend: async (reportId: number, reason: string): Promise<AnnualReportFull> => {
    const res = await api.post<AnnualReportFull>(ENDPOINTS.annualReportAmend(reportId), { reason });
    return res.data;
  },
};
