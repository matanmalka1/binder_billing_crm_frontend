import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { toQueryParams } from "@/api/queryParams";
import type { PaginatedResponse } from "@/types/common";
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
  list: async (params: ListAdvancePaymentsParams): Promise<PaginatedResponse<AdvancePaymentRow>> => {
    const { business_id, ...queryParams } = params;
    const response = await api.get<PaginatedResponse<AdvancePaymentRow>>(
      ENDPOINTS.businessAdvancePayments(business_id),
      { params: toQueryParams(queryParams) },
    );
    return response.data;
  },

  create: async (payload: CreateAdvancePaymentPayload): Promise<AdvancePaymentRow> => {
    const response = await api.post<AdvancePaymentRow>(
      ENDPOINTS.businessAdvancePayments(payload.business_id),
      payload,
    );
    return response.data;
  },

  update: async (
    businessId: number,
    id: number,
    payload: UpdateAdvancePaymentPayload,
  ): Promise<AdvancePaymentRow> => {
    const response = await api.patch<AdvancePaymentRow>(
      ENDPOINTS.businessAdvancePaymentById(businessId, id),
      payload,
    );
    return response.data;
  },

  overview: async (params: ListAdvancePaymentsOverviewParams): Promise<AdvancePaymentOverviewResponse> => {
    const response = await api.get<AdvancePaymentOverviewResponse>(
      ENDPOINTS.advancePaymentsOverview,
      { params: toQueryParams(params) },
    );
    return response.data;
  },

  delete: async (businessId: number, id: number): Promise<void> => {
    await api.delete(ENDPOINTS.businessAdvancePaymentById(businessId, id));
  },

  getSuggestion: async (clientId: number, year: number): Promise<AdvancePaymentSuggestionResponse> => {
    const response = await api.get<AdvancePaymentSuggestionResponse>(
      ENDPOINTS.businessAdvancePaymentSuggest(clientId),
      { params: toQueryParams({ year }) },
    );
    return response.data;
  },

  getAnnualKPIs: async (clientId: number, year: number): Promise<AnnualKPIResponse> => {
    const response = await api.get<AnnualKPIResponse>(
      ENDPOINTS.businessAdvancePaymentsKPI(clientId),
      { params: toQueryParams({ year }) },
    );
    return response.data;
  },

  getChartData: async (clientId: number, year: number): Promise<ChartDataResponse> => {
    const response = await api.get<ChartDataResponse>(
      ENDPOINTS.businessAdvancePaymentsChart(clientId),
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
      ENDPOINTS.advancePaymentsGenerate,
      { business_id: clientId, year, period_months_count: periodMonthsCount },
    );
    return response.data;
  },
};
