import { api } from "@/api/client";
import { toQueryParams } from "@/api/queryParams";
import { REPORT_ENDPOINTS } from "./endpoints";
import type {
  AgingReportResponse,
  AdvancePaymentReportResponse,
  AnnualReportStatusReportResponse,
  VatComplianceReportResponse,
  ExportFormat,
  ReportExportResult,
} from "./contracts";

export const reportsApi = {
  // ── Queries ──────────────────────────────────────────────────────────────

  getAgingReport: async (asOfDate?: string): Promise<AgingReportResponse> => {
    const response = await api.get<AgingReportResponse>(REPORT_ENDPOINTS.reportsAging, {
      params: toQueryParams({ as_of_date: asOfDate }),
    });
    return response.data;
  },

  getAdvancePaymentReport: async (
    year: number,
    month?: number,
  ): Promise<AdvancePaymentReportResponse> => {
    const params: Record<string, unknown> = { year };
    if (month !== undefined) params.month = month;
    const response = await api.get<AdvancePaymentReportResponse>(
      REPORT_ENDPOINTS.reportsAdvancePayments,
      { params: toQueryParams(params) },
    );
    return response.data;
  },

  getAnnualReportStatusReport: async (
    taxYear: number,
  ): Promise<AnnualReportStatusReportResponse> => {
    const response = await api.get<AnnualReportStatusReportResponse>(
      REPORT_ENDPOINTS.reportsAnnualReportStatus,
      { params: toQueryParams({ tax_year: taxYear }) },
    );
    return response.data;
  },

  getVatComplianceReport: async (year: number): Promise<VatComplianceReportResponse> => {
    const response = await api.get<VatComplianceReportResponse>(
      REPORT_ENDPOINTS.reportsVatCompliance,
      { params: toQueryParams({ year }) },
    );
    return response.data;
  },

  // ── Mutations ────────────────────────────────────────────────────────────

  exportAgingReport: async (
    format: ExportFormat,
    asOfDate?: string,
  ): Promise<ReportExportResult> => {
    const response = await api.get<Blob>(REPORT_ENDPOINTS.reportsAgingExport, {
      params: toQueryParams({ format, as_of_date: asOfDate }),
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
};
