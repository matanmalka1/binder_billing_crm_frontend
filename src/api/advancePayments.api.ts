import { api } from "./client";
import { ENDPOINTS } from "./endpoints";
import { toQueryParams } from "./queryParams";
import type { PaginatedResponse } from "../types/common";

export type AdvancePaymentStatus = "pending" | "paid" | "partial" | "overdue";

export interface AdvancePaymentRow {
  id: number;
  client_id: number;
  month: number;
  year: number;
  expected_amount: number | null;
  paid_amount: number | null;
  status: AdvancePaymentStatus;
  due_date: string;
  tax_deadline_id: number | null;
  notes: string | null;
  delta: number | null;
  created_at: string;
  updated_at: string | null;
}

export interface ListAdvancePaymentsParams {
  client_id: number;
  year: number;
  status?: AdvancePaymentStatus[];
  page?: number;
  page_size?: number;
}

export interface CreateAdvancePaymentPayload {
  client_id: number;
  year: number;
  month: number;
  due_date: string;
  expected_amount?: number | null;
  paid_amount?: number | null;
  tax_deadline_id?: number | null;
  notes?: string | null;
}

export interface UpdateAdvancePaymentPayload {
  paid_amount?: number | null;
  expected_amount?: number | null;
  status?: AdvancePaymentStatus;
  notes?: string | null;
}

export interface AdvancePaymentOverviewRow {
  id: number;
  client_id: number;
  client_name: string;
  month: number;
  year: number;
  expected_amount: number | null;
  paid_amount: number | null;
  status: AdvancePaymentStatus;
  due_date: string;
}

export interface ListAdvancePaymentsOverviewParams {
  year: number;
  month?: number;
  status?: AdvancePaymentStatus[];
  page?: number;
  page_size?: number;
}

export interface AdvancePaymentOverviewResponse {
  items: AdvancePaymentOverviewRow[];
  page: number;
  page_size: number;
  total: number;
  total_expected: number | null;
  total_paid: number | null;
  collection_rate: number | null;
}

export interface AdvancePaymentSuggestionResponse {
  client_id: number;
  year: number;
  suggested_amount: number | null;
  has_data: boolean;
}

export interface AnnualKPIResponse {
  client_id: number;
  year: number;
  total_expected: number;
  total_paid: number;
  collection_rate: number;
  overdue_count: number;
  on_time_count: number;
}

export interface MonthlyChartRow {
  month: number;
  expected_amount: number;
  paid_amount: number;
  overdue_amount: number;
}

export interface ChartDataResponse {
  client_id: number;
  year: number;
  months: MonthlyChartRow[];
}

export const advancePaymentsApi = {
  list: async (
    params: ListAdvancePaymentsParams,
  ): Promise<PaginatedResponse<AdvancePaymentRow>> => {
    const response = await api.get<PaginatedResponse<AdvancePaymentRow>>(
      ENDPOINTS.advancePayments,
      { params: toQueryParams(params) },
    );
    return response.data;
  },

  create: async (
    payload: CreateAdvancePaymentPayload,
  ): Promise<AdvancePaymentRow> => {
    const response = await api.post<AdvancePaymentRow>(
      ENDPOINTS.advancePayments,
      payload,
    );
    return response.data;
  },

  update: async (
    id: number,
    payload: UpdateAdvancePaymentPayload,
  ): Promise<AdvancePaymentRow> => {
    const response = await api.patch<AdvancePaymentRow>(
      ENDPOINTS.advancePaymentById(id),
      payload,
    );
    return response.data;
  },

  overview: async (
    params: ListAdvancePaymentsOverviewParams,
  ): Promise<AdvancePaymentOverviewResponse> => {
    const response = await api.get<AdvancePaymentOverviewResponse>(
      ENDPOINTS.advancePaymentsOverview, { params: toQueryParams(params) },
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(ENDPOINTS.advancePaymentById(id));
  },

  getSuggestion: async (
    clientId: number,
    year: number,
  ): Promise<AdvancePaymentSuggestionResponse> => {
    const response = await api.get<AdvancePaymentSuggestionResponse>(
      ENDPOINTS.advancePaymentSuggest,
      { params: toQueryParams({ client_id: clientId, year }) },
    );
    return response.data;
  },

  getAnnualKPIs: async (clientId: number, year: number): Promise<AnnualKPIResponse> => {
    const response = await api.get<AnnualKPIResponse>(
      ENDPOINTS.advancePaymentsKPI,
      { params: toQueryParams({ client_id: clientId, year }) },
    );
    return response.data;
  },

  getChartData: async (clientId: number, year: number): Promise<ChartDataResponse> => {
    const response = await api.get<ChartDataResponse>(
      ENDPOINTS.advancePaymentsChart,
      { params: toQueryParams({ client_id: clientId, year }) },
    );
    return response.data;
  },
};
