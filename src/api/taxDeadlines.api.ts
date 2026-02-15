import { ENDPOINTS } from "./endpoints";
import { toQueryParams } from "./queryParams";
import { api } from "./client";
import type { PaginatedResponse } from "../types/common";

export interface TaxDeadlineResponse {
  id: number;
  client_id: number;
  deadline_type: string;
  due_date: string;
  status: string;
  payment_amount: number | null;
  currency: string;
  description: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface DeadlineUrgentItem {
  id: number;
  client_id: number;
  client_name: string;
  deadline_type: string;
  due_date: string;
  urgency: string;
  days_remaining: number;
  payment_amount: number | null;
}

export const taxDeadlinesApi = {
  createTaxDeadline: async (payload: {
    client_id: number;
    deadline_type: string;
    due_date: string;
    payment_amount?: number | null;
    description?: string | null;
  }): Promise<TaxDeadlineResponse> => {
    const response = await api.post<TaxDeadlineResponse>(
      ENDPOINTS.taxDeadlines,
      payload
    );
    return response.data;
  },

  listTaxDeadlines: async (params: {
    client_id?: number;
    deadline_type?: string;
    status?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<TaxDeadlineResponse>> => {
    const response = await api.get<PaginatedResponse<TaxDeadlineResponse>>(
      ENDPOINTS.taxDeadlines,
      { params: toQueryParams(params) }
    );
    return response.data;
  },

  getTaxDeadline: async (deadlineId: number): Promise<TaxDeadlineResponse> => {
    const response = await api.get<TaxDeadlineResponse>(
      ENDPOINTS.taxDeadlineById(deadlineId)
    );
    return response.data;
  },

  completeTaxDeadline: async (
    deadlineId: number
  ): Promise<TaxDeadlineResponse> => {
    const response = await api.post<TaxDeadlineResponse>(
      ENDPOINTS.taxDeadlineComplete(deadlineId)
    );
    return response.data;
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
};
