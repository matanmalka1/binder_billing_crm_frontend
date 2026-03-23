import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
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

  listClientReports: async (businessId: number): Promise<AnnualReportFull[]> => {
    const res = await api.get<AnnualReportListResponse>(ENDPOINTS.clientAnnualReports(businessId));
    return res.data.items;
  },

  getSchedules: async (reportId: number): Promise<ScheduleEntry[]> => {
    const res = await api.get<ScheduleEntry[]>(ENDPOINTS.annualReportSchedules(reportId));
    return res.data;
  },

  addSchedule: async (
    reportId: number,
    payload: { schedule: AnnualReportScheduleKey; notes?: string | null },
  ): Promise<ScheduleEntry> => {
    const res = await api.post<ScheduleEntry>(ENDPOINTS.annualReportSchedules(reportId), payload);
    return res.data;
  },

  completeSchedule: async (reportId: number, schedule: AnnualReportScheduleKey): Promise<ScheduleEntry> => {
    const res = await api.post<ScheduleEntry>(ENDPOINTS.annualReportSchedulesComplete(reportId), { schedule });
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
    payload: Partial<ReportDetailResponse>,
  ): Promise<ReportDetailResponse> => {
    const res = await api.patch<ReportDetailResponse>(ENDPOINTS.annualReportDetails(reportId), payload);
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
    payload: AnnexDataAddPayload,
  ): Promise<AnnexDataLine> => {
    const res = await api.post<AnnexDataLine>(ENDPOINTS.annualReportAnnex(reportId, schedule), payload);
    return res.data;
  },

  updateAnnexLine: async (
    reportId: number,
    schedule: AnnualReportScheduleKey,
    lineId: number,
    payload: AnnexDataAddPayload,
  ): Promise<AnnexDataLine> => {
    const res = await api.patch<AnnexDataLine>(
      ENDPOINTS.annualReportAnnexLine(reportId, schedule, lineId),
      payload,
    );
    return res.data;
  },

  deleteAnnexLine: async (
    reportId: number,
    schedule: AnnualReportScheduleKey,
    lineId: number,
  ): Promise<void> => {
    await api.delete(ENDPOINTS.annualReportAnnexLine(reportId, schedule, lineId));
  },

  amend: async (reportId: number, reason: string): Promise<AnnualReportFull> => {
    const res = await api.post<AnnualReportFull>(ENDPOINTS.annualReportAmend(reportId), { reason });
    return res.data;
  },

  exportPdf: async (reportId: number, taxYear: number): Promise<void> => {
    const response = await api.get<Blob>(ENDPOINTS.annualReportExportPdf(reportId), {
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
