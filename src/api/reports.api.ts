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
    const filenameMatch = contentDisposition?.match(/filename=\"?([^\";]+)\"?/);
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
};
