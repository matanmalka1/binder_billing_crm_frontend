export interface AgingBucket {
  current: number;
  days_30: number;
  days_60: number;
  days_90_plus: number;
}

export interface AgingReportItem {
  client_record_id: number;
  client_name: string;
  total_outstanding: number;
  current: number;
  days_30: number;
  days_60: number;
  days_90_plus: number;
  oldest_invoice_date: string | null;
  oldest_invoice_days: number | null;
}

export interface AgingReportResponse {
  report_date: string;
  total_outstanding: number;
  items: AgingReportItem[];
  summary: AgingBucket;
  capped: boolean;
  cap_limit: number;
}

export interface AnnualReportClientEntry {
  client_record_id: number;
  client_name: string;
  form_type: string | null;
  filing_deadline: string | null;
  days_until_deadline: number | null;
}

export interface AnnualReportStatusGroup {
  status: string;
  count: number;
  clients: AnnualReportClientEntry[];
}

export interface AnnualReportStatusReportResponse {
  tax_year: number;
  total: number;
  statuses: AnnualReportStatusGroup[];
}

export interface AdvancePaymentReportItem {
  client_record_id: number;
  client_name: string;
  total_expected: number;
  total_paid: number;
  overdue_count: number;
  gap: number;
}

export interface AdvancePaymentReportResponse {
  year: number;
  month: number | null;
  total_expected: number;
  total_paid: number;
  collection_rate: number;
  total_gap: number;
  items: AdvancePaymentReportItem[];
}

export interface VatComplianceItem {
  client_record_id: number;
  client_name: string;
  periods_expected: number;
  periods_filed: number;
  periods_open: number;
  on_time_count: number;
  late_count: number;
  compliance_rate: number;
}

export interface StalePendingItem {
  client_record_id: number;
  client_name: string;
  period: string;
  days_pending: number;
}

export interface VatComplianceReportResponse {
  year: number;
  total_clients: number;
  items: VatComplianceItem[];
  stale_pending: StalePendingItem[];
}

export type ExportFormat = "excel" | "pdf";

export interface ReportExportResult {
  filename: string;
}
