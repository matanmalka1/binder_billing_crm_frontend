import { api } from "@/api/client";
import { toQueryParams } from "@/api/queryParams";
import { ANNUAL_REPORT_ENDPOINTS } from "./endpoints";
import type {
  AnnualReportFull,
  AnnualReportListResponse,
  AnnualReportScheduleKey,
  CreateAnnualReportPayload,
  ReportDetailResponse,
  ScheduleEntry,
  StatusHistoryEntry,
  AnnexDataLine,
  AnnexDataAddPayload,
} from "./contracts";

export const annualReportsApi = {
  createReport: async (payload: CreateAnnualReportPayload): Promise<AnnualReportFull> => {
    const response = await api.post<AnnualReportFull>(ANNUAL_REPORT_ENDPOINTS.annualReports, payload);
    return response.data;
  },

  getReport: async (reportId: number): Promise<AnnualReportFull> => {
    const response = await api.get<AnnualReportFull>(ANNUAL_REPORT_ENDPOINTS.annualReportById(reportId));
    return response.data;
  },

  listReports: async (params: {
    tax_year?: number;
    page?: number;
    page_size?: number;
  }): Promise<AnnualReportListResponse> => {
    const response = await api.get<AnnualReportListResponse>(ANNUAL_REPORT_ENDPOINTS.annualReports, {
      params: toQueryParams(params),
    });
    return response.data;
  },

  listClientReports: async (clientId: number): Promise<AnnualReportFull[]> => {
    const response = await api.get<AnnualReportListResponse>(
      ANNUAL_REPORT_ENDPOINTS.clientAnnualReports(clientId),
    );
    return response.data.items;
  },

  getSchedules: async (reportId: number): Promise<ScheduleEntry[]> => {
    const response = await api.get<ScheduleEntry[]>(ANNUAL_REPORT_ENDPOINTS.annualReportSchedules(reportId));
    return response.data;
  },

  addSchedule: async (
    reportId: number,
    payload: { schedule: AnnualReportScheduleKey; notes?: string | null },
  ): Promise<ScheduleEntry> => {
    const response = await api.post<ScheduleEntry>(
      ANNUAL_REPORT_ENDPOINTS.annualReportSchedules(reportId),
      payload,
    );
    return response.data;
  },

  completeSchedule: async (reportId: number, schedule: AnnualReportScheduleKey): Promise<ScheduleEntry> => {
    const response = await api.post<ScheduleEntry>(
      ANNUAL_REPORT_ENDPOINTS.annualReportSchedulesComplete(reportId),
      { schedule },
    );
    return response.data;
  },

  getHistory: async (reportId: number): Promise<StatusHistoryEntry[]> => {
    const response = await api.get<StatusHistoryEntry[]>(ANNUAL_REPORT_ENDPOINTS.annualReportHistory(reportId));
    return response.data;
  },

  getReportDetails: async (reportId: number): Promise<ReportDetailResponse> => {
    const response = await api.get<ReportDetailResponse>(ANNUAL_REPORT_ENDPOINTS.annualReportDetails(reportId));
    return response.data;
  },

  patchReportDetails: async (
    reportId: number,
    payload: Partial<ReportDetailResponse>,
  ): Promise<ReportDetailResponse> => {
    const response = await api.patch<ReportDetailResponse>(
      ANNUAL_REPORT_ENDPOINTS.annualReportDetails(reportId),
      payload,
    );
    return response.data;
  },

  deleteReport: async (reportId: number): Promise<void> => {
    await api.delete(ANNUAL_REPORT_ENDPOINTS.annualReportById(reportId));
  },

  getAnnexLines: async (reportId: number, schedule: AnnualReportScheduleKey): Promise<AnnexDataLine[]> => {
    const response = await api.get<AnnexDataLine[]>(
      ANNUAL_REPORT_ENDPOINTS.annualReportAnnex(reportId, schedule),
    );
    return response.data;
  },

  addAnnexLine: async (
    reportId: number,
    schedule: AnnualReportScheduleKey,
    payload: AnnexDataAddPayload,
  ): Promise<AnnexDataLine> => {
    const response = await api.post<AnnexDataLine>(
      ANNUAL_REPORT_ENDPOINTS.annualReportAnnex(reportId, schedule),
      payload,
    );
    return response.data;
  },

  updateAnnexLine: async (
    reportId: number,
    schedule: AnnualReportScheduleKey,
    lineId: number,
    payload: AnnexDataAddPayload,
  ): Promise<AnnexDataLine> => {
    const response = await api.patch<AnnexDataLine>(
      ANNUAL_REPORT_ENDPOINTS.annualReportAnnexLine(reportId, schedule, lineId),
      payload,
    );
    return response.data;
  },

  deleteAnnexLine: async (
    reportId: number,
    schedule: AnnualReportScheduleKey,
    lineId: number,
  ): Promise<void> => {
    await api.delete(ANNUAL_REPORT_ENDPOINTS.annualReportAnnexLine(reportId, schedule, lineId));
  },

  amend: async (reportId: number, reason: string): Promise<AnnualReportFull> => {
    const response = await api.post<AnnualReportFull>(ANNUAL_REPORT_ENDPOINTS.annualReportAmend(reportId), {
      reason,
    });
    return response.data;
  },

  exportPdf: async (reportId: number, taxYear: number): Promise<void> => {
    const response = await api.get<Blob>(ANNUAL_REPORT_ENDPOINTS.annualReportExportPdf(reportId), {
      responseType: "blob",
    });
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `annual_report_${reportId}_${taxYear}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
