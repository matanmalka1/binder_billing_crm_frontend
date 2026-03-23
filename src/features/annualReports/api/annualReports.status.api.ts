import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { AnnualReportFull, DeadlineType, StageKey, StatusTransitionPayload } from "./contracts";

export const annualReportStatusApi = {
  transitionStatus: async (reportId: number, payload: StatusTransitionPayload): Promise<AnnualReportFull> => {
    const res = await api.post<AnnualReportFull>(ENDPOINTS.annualReportTransitionStatus(reportId), payload);
    return res.data;
  },

  submitReport: async (
    reportId: number,
    payload: { submitted_at?: string; ita_reference?: string | null; note?: string | null } = {},
  ): Promise<AnnualReportFull> => {
    const res = await api.post<AnnualReportFull>(ENDPOINTS.annualReportSubmit(reportId), payload);
    return res.data;
  },

  transitionStage: async (reportId: number, toStage: StageKey): Promise<AnnualReportFull> => {
    const res = await api.post<AnnualReportFull>(ENDPOINTS.annualReportTransition(reportId), {
      to_stage: toStage,
    });
    return res.data;
  },

  updateDeadline: async (
    reportId: number,
    payload: { deadline_type: DeadlineType; custom_deadline_note?: string | null },
  ): Promise<AnnualReportFull> => {
    const res = await api.post<AnnualReportFull>(ENDPOINTS.annualReportDeadline(reportId), payload);
    return res.data;
  },
};
