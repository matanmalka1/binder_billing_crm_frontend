import { ENDPOINTS } from "./endpoints";
import { api } from "./client";

export interface AgingBucket {
  current: number;
  days_30: number;
  days_60: number;
  days_90_plus: number;
}

export interface AgingReportItem {
  client_id: number;
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
  client_id: number;
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
  client_id: number;
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
  client_id: number;
  client_name: string;
  periods_expected: number;
  periods_filed: number;
  periods_open: number;
  on_time_count: number;
  late_count: number;
  compliance_rate: number;
}

export interface StalePendingItem {
  client_id: number;
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

// Note: Backend uses float for bucket fields; TS `number` already covers both int/float.

export type ExportFormat = "excel" | "pdf";

export interface ReportExportResult {
  filename: string;
}

export const reportsApi = {
  getAgingReport: async (asOfDate?: string): Promise<AgingReportResponse> => {
    const params = asOfDate ? { as_of_date: asOfDate } : undefined;
    const response = await api.get<AgingReportResponse>(
      ENDPOINTS.reportsAging,
      { params }
    );
    return response.data;
  },

  exportAgingReport: async (
    format: ExportFormat,
    asOfDate?: string,
  ): Promise<ReportExportResult> => {
    const response = await api.get<Blob>(ENDPOINTS.reportsAgingExport, {
      params: { format, ...(asOfDate ? { as_of_date: asOfDate } : {}) },
      responseType: "blob",
    });

    const contentDisposition = response.headers["content-disposition"];
    const filenameMatch = contentDisposition?.match(/filename="?([^";]+)"?/);
    const filename =
      filenameMatch?.[1] ||
      `aging_report.${format === "excel" ? "xlsx" : "pdf"}`;

    const blob = new Blob([response.data], {
      type:
        response.headers["content-type"] ||
        (format === "excel"
          ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          : "application/pdf"),
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { filename };
  },

  downloadExport: (downloadUrl: string): void => {
    window.open(downloadUrl, "_blank");
  },

  getAdvancePaymentReport: async (
    year: number,
    month?: number,
  ): Promise<AdvancePaymentReportResponse> => {
    const params: Record<string, unknown> = { year };
    if (month !== undefined) params.month = month;
    const response = await api.get<AdvancePaymentReportResponse>(
      ENDPOINTS.reportsAdvancePayments,
      { params },
    );
    return response.data;
  },

  getAnnualReportStatusReport: async (
    taxYear: number,
  ): Promise<AnnualReportStatusReportResponse> => {
    const response = await api.get<AnnualReportStatusReportResponse>(
      ENDPOINTS.reportsAnnualReportStatus,
      { params: { tax_year: taxYear } },
    );
    return response.data;
  },

  getVatComplianceReport: async (year: number): Promise<VatComplianceReportResponse> => {
    const response = await api.get<VatComplianceReportResponse>(
      ENDPOINTS.reportsVatCompliance,
      { params: { year } },
    );
    return response.data;
  },
};
