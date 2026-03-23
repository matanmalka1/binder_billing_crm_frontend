import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { ExportFormat, ReportExportResult } from "./contracts";

export const reportsMutationsApi = {
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
};
