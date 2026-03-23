import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { AnnualReportFull, AnnualReportListResponse, KanbanStage, SeasonSummary } from "./contracts";

export const annualReportSeasonApi = {
  getSeasonSummary: async (taxYear: number): Promise<SeasonSummary> => {
    const res = await api.get<SeasonSummary>(ENDPOINTS.taxYearSummary(taxYear));
    return res.data;
  },

  listSeasonReports: async (
    taxYear: number,
    params: { page?: number; page_size?: number },
  ): Promise<AnnualReportListResponse> => {
    const res = await api.get<AnnualReportListResponse>(ENDPOINTS.taxYearReports(taxYear), { params });
    return res.data;
  },

  getKanbanView: async (): Promise<{ stages: KanbanStage[] }> => {
    const res = await api.get<{ stages: KanbanStage[] }>(ENDPOINTS.annualReportsKanban);
    return res.data;
  },

  getOverdue: async (taxYear?: number): Promise<AnnualReportFull[]> => {
    const res = await api.get<AnnualReportFull[]>(ENDPOINTS.annualReportOverdue, {
      params: taxYear ? { tax_year: taxYear } : undefined,
    });
    return res.data;
  },
};
