import { api } from "./client";
import { ENDPOINTS } from "./endpoints";
import { toQueryParams } from "./queryParams";
import type { PaginatedResponse } from "../types/common";
import type {
  AdvancePaymentStatus,
  AdvancePaymentRow,
  ListAdvancePaymentsParams,
  CreateAdvancePaymentPayload,
  UpdateAdvancePaymentPayload,
  ListAdvancePaymentsOverviewParams,
  AdvancePaymentOverviewResponse,
  AdvancePaymentSuggestionResponse,
  AnnualKPIResponse,
  ChartDataResponse,
} from "../features/advancedPayments/types";

export type { AdvancePaymentStatus, AdvancePaymentRow, ListAdvancePaymentsParams, CreateAdvancePaymentPayload, UpdateAdvancePaymentPayload, ListAdvancePaymentsOverviewParams, AdvancePaymentOverviewResponse, AdvancePaymentSuggestionResponse, AnnualKPIResponse, ChartDataResponse };

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

  generateSchedule: async (
    clientId: number,
    year: number,
  ): Promise<{ created: number; skipped: number }> => {
    const response = await api.post<{ created: number; skipped: number }>(
      ENDPOINTS.advancePaymentsGenerate,
      { client_id: clientId, year },
    );
    return response.data;
  },
};
