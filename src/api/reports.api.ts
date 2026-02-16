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
}

export type ExportFormat = "excel" | "pdf";

export interface ReportExportResponse {
  download_url: string;
  filename: string;
  format: ExportFormat;
  generated_at: string;
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

  exportAgingReport: async (format: ExportFormat): Promise<ReportExportResponse> => {
    const response = await api.get<ReportExportResponse>(
      ENDPOINTS.reportsAgingExport,
      { params: { format } }
    );
    return response.data;
  },

  downloadExport: (downloadUrl: string): void => {
    window.open(downloadUrl, "_blank");
  },
};
