import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { toQueryParams } from "@/api/queryParams";
import type {
  TaxDeadlineResponse,
  TaxDeadlineListResponse,
  TimelineEntry,
  DeadlineUrgentItem,
} from "./contracts";

export const taxDeadlinesApi = {
  createTaxDeadline: async (payload: {
    business_id: number;
    deadline_type: string;
    due_date: string;
    period?: string | null;
    payment_amount?: string | null;
    description?: string | null;
  }): Promise<TaxDeadlineResponse> => {
    const response = await api.post<TaxDeadlineResponse>(ENDPOINTS.taxDeadlines, payload);
    return response.data;
  },

  listTaxDeadlines: async (params: {
    business_name?: string;
    client_name?: string;
    deadline_type?: string;
    status?: string;
    page?: number;
    page_size?: number;
  }): Promise<TaxDeadlineListResponse> => {
    const normalizedParams =
      params.business_name == null && params.client_name != null
        ? { ...params, business_name: params.client_name }
        : params;
    const response = await api.get<TaxDeadlineListResponse>(
      ENDPOINTS.taxDeadlines,
      { params: toQueryParams(normalizedParams) },
    );
    return response.data;
  },

  getTaxDeadline: async (deadlineId: number): Promise<TaxDeadlineResponse> => {
    const response = await api.get<TaxDeadlineResponse>(ENDPOINTS.taxDeadlineById(deadlineId));
    return response.data;
  },

  completeTaxDeadline: async (deadlineId: number): Promise<TaxDeadlineResponse> => {
    const response = await api.post<TaxDeadlineResponse>(ENDPOINTS.taxDeadlineComplete(deadlineId));
    return response.data;
  },

  updateTaxDeadline: async (
    deadlineId: number,
    payload: {
      deadline_type?: string;
      due_date?: string;
      period?: string | null;
      payment_amount?: string | null;
      description?: string | null;
    },
  ): Promise<TaxDeadlineResponse> => {
    const response = await api.put<TaxDeadlineResponse>(ENDPOINTS.taxDeadlineById(deadlineId), payload);
    return response.data;
  },

  deleteTaxDeadline: async (deadlineId: number): Promise<void> => {
    await api.delete(ENDPOINTS.taxDeadlineById(deadlineId));
  },

  getDashboardDeadlines: async (): Promise<{
    urgent: DeadlineUrgentItem[];
    upcoming: TaxDeadlineResponse[];
  }> => {
    const response = await api.get<{
      urgent: DeadlineUrgentItem[];
      upcoming: TaxDeadlineResponse[];
    }>(ENDPOINTS.taxDeadlinesDashboard);
    return response.data;
  },

  getTimeline: async (businessId: number): Promise<TimelineEntry[]> => {
    const response = await api.get<TimelineEntry[]>(
      ENDPOINTS.taxDeadlinesTimeline,
      { params: toQueryParams({ business_id: businessId }) },
    );
    return response.data;
  },

  generateDeadlines: async (payload: {
    business_id: number;
    year: number;
  }): Promise<{ created_count: number }> => {
    const response = await api.post<{ created_count: number }>(
      ENDPOINTS.taxDeadlinesGenerate,
      payload,
    );
    return response.data;
  },
};
