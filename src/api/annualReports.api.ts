import { ENDPOINTS } from "./endpoints";
import { toQueryParams } from "./queryParams";
import { api } from "./client";
import type { PaginatedResponse } from "../types/common";

export interface AnnualReportResponse {
  id: number;
  client_id: number;
  tax_year: number;
  stage: string;
  status: string;
  created_at: string;
  due_date: string | null;
  submitted_at: string | null;
  form_type: string | null;
  notes: string | null;
}

export interface KanbanStageResponse {
  stage: string;
  reports: Array<{
    id: number;
    client_id: number;
    client_name: string;
    tax_year: number;
    days_until_due: number | null;
  }>;
}

export const annualReportsApi = {
  createAnnualReport: async (payload: {
    client_id: number;
    tax_year: number;
    form_type?: string | null;
    due_date?: string | null;
    notes?: string | null;
  }): Promise<AnnualReportResponse> => {
    const response = await api.post<AnnualReportResponse>(
      ENDPOINTS.annualReports,
      payload
    );
    return response.data;
  },

  listAnnualReports: async (params: {
    client_id?: number;
    tax_year?: number;
    stage?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<AnnualReportResponse>> => {
    const response = await api.get<PaginatedResponse<AnnualReportResponse>>(
      ENDPOINTS.annualReports,
      { params: toQueryParams(params) }
    );
    return response.data;
  },

  getAnnualReport: async (reportId: number): Promise<AnnualReportResponse> => {
    const response = await api.get<AnnualReportResponse>(
      ENDPOINTS.annualReportById(reportId)
    );
    return response.data;
  },

  transitionAnnualReport: async (
    reportId: number,
    toStage: string
  ): Promise<AnnualReportResponse> => {
    const response = await api.post<AnnualReportResponse>(
      ENDPOINTS.annualReportTransition(reportId),
      { to_stage: toStage }
    );
    return response.data;
  },

  submitAnnualReport: async (reportId: number): Promise<AnnualReportResponse> => {
    const response = await api.post<AnnualReportResponse>(
      ENDPOINTS.annualReportSubmit(reportId),
      { submitted_at: new Date().toISOString() }
    );
    return response.data;
  },

  getKanbanView: async (): Promise<{ stages: KanbanStageResponse[] }> => {
    const response = await api.get<{ stages: KanbanStageResponse[] }>(
      ENDPOINTS.annualReportsKanban
    );
    return response.data;
  },
};
