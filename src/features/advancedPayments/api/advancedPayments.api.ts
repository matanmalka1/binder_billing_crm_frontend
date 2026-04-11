import { api } from "@/api/client";
import { ADVANCE_PAYMENT_ENDPOINTS } from "./endpoints";
import { toQueryParams } from "@/api/queryParams";
import type { PaginatedResponse } from "@/types";
import type {
  AdvancePaymentRow,
  ListAdvancePaymentsParams,
  CreateAdvancePaymentPayload,
  UpdateAdvancePaymentPayload,
  ListAdvancePaymentsOverviewParams,
  AdvancePaymentOverviewResponse,
  AdvancePaymentSuggestionResponse,
  AnnualKPIResponse,
  ChartDataResponse,
} from "../types";

export const advancePaymentsApi = {
  list: async (
    params: ListAdvancePaymentsParams,
  ): Promise<PaginatedResponse<AdvancePaymentRow>> => {
    const { client_id, ...queryParams } = params;
    const response = await api.get<PaginatedResponse<AdvancePaymentRow>>(
      ADVANCE_PAYMENT_ENDPOINTS.clientAdvancePayments(client_id),
      { params: toQueryParams(queryParams) },
    );
    return response.data;
  },

  create: async (
    clientId: number,
    payload: CreateAdvancePaymentPayload,
  ): Promise<AdvancePaymentRow> => {
    const response = await api.post<AdvancePaymentRow>(
      ADVANCE_PAYMENT_ENDPOINTS.clientAdvancePayments(clientId),
      payload,
    );
    return response.data;
  },

  update: async (
    clientId: number,
    id: number,
    payload: UpdateAdvancePaymentPayload,
  ): Promise<AdvancePaymentRow> => {
    const response = await api.patch<AdvancePaymentRow>(
      ADVANCE_PAYMENT_ENDPOINTS.clientAdvancePaymentById(clientId, id),
      payload,
    );
    return response.data;
  },

  overview: async (
    params: ListAdvancePaymentsOverviewParams,
  ): Promise<AdvancePaymentOverviewResponse> => {
    const response = await api.get<AdvancePaymentOverviewResponse>(
      ADVANCE_PAYMENT_ENDPOINTS.advancePaymentsOverview,
      { params: toQueryParams(params) },
    );
    return response.data;
  },

  delete: async (clientId: number, id: number): Promise<void> => {
    await api.delete(
      ADVANCE_PAYMENT_ENDPOINTS.clientAdvancePaymentById(clientId, id),
    );
  },

  getSuggestion: async (
    clientId: number,
    year: number,
    periodMonthsCount: 1 | 2,
  ): Promise<AdvancePaymentSuggestionResponse> => {
    const response = await api.get<AdvancePaymentSuggestionResponse>(
      ADVANCE_PAYMENT_ENDPOINTS.clientAdvancePaymentSuggest(clientId),
      {
        params: toQueryParams({ year, period_months_count: periodMonthsCount }),
      },
    );
    return response.data;
  },

  getAnnualKPIs: async (
    clientId: number,
    year: number,
  ): Promise<AnnualKPIResponse> => {
    const response = await api.get<AnnualKPIResponse>(
      ADVANCE_PAYMENT_ENDPOINTS.clientAdvancePaymentsKPI(clientId),
      { params: toQueryParams({ year }) },
    );
    return response.data;
  },

  getChartData: async (
    clientId: number,
    year: number,
  ): Promise<ChartDataResponse> => {
    const response = await api.get<ChartDataResponse>(
      ADVANCE_PAYMENT_ENDPOINTS.clientAdvancePaymentsChart(clientId),
      { params: toQueryParams({ year }) },
    );
    return response.data;
  },

  generateSchedule: async (
    clientId: number,
    year: number,
    periodMonthsCount: 1 | 2,
  ): Promise<{ created: number; skipped: number }> => {
    const response = await api.post<{ created: number; skipped: number }>(
      ADVANCE_PAYMENT_ENDPOINTS.clientAdvancePaymentsGenerate(clientId),
      { year, period_months_count: periodMonthsCount },
    );
    return response.data;
  },
};
