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
    const { business_id, ...queryParams } = params;
    const response = await api.get<PaginatedResponse<AdvancePaymentRow>>(
      ADVANCE_PAYMENT_ENDPOINTS.businessAdvancePayments(business_id),
      { params: toQueryParams(queryParams) },
    );
    return response.data;
  },

  create: async (
    payload: CreateAdvancePaymentPayload,
  ): Promise<AdvancePaymentRow> => {
    const response = await api.post<AdvancePaymentRow>(
      ADVANCE_PAYMENT_ENDPOINTS.businessAdvancePayments(payload.business_id),
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
      ADVANCE_PAYMENT_ENDPOINTS.businessAdvancePaymentById(businessId, id),
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

  delete: async (businessId: number, id: number): Promise<void> => {
    await api.delete(
      ADVANCE_PAYMENT_ENDPOINTS.businessAdvancePaymentById(businessId, id),
    );
  },

  getSuggestion: async (
    businessId: number,
    year: number,
    periodMonthsCount: 1 | 2,
  ): Promise<AdvancePaymentSuggestionResponse> => {
    const response = await api.get<AdvancePaymentSuggestionResponse>(
      ADVANCE_PAYMENT_ENDPOINTS.businessAdvancePaymentSuggest(businessId),
      {
        params: toQueryParams({ year, period_months_count: periodMonthsCount }),
      },
    );
    return response.data;
  },

  getAnnualKPIs: async (
    businessId: number,
    year: number,
  ): Promise<AnnualKPIResponse> => {
    const response = await api.get<AnnualKPIResponse>(
      ADVANCE_PAYMENT_ENDPOINTS.businessAdvancePaymentsKPI(businessId),
      { params: toQueryParams({ year }) },
    );
    return response.data;
  },

  getChartData: async (
    businessId: number,
    year: number,
  ): Promise<ChartDataResponse> => {
    const response = await api.get<ChartDataResponse>(
      ADVANCE_PAYMENT_ENDPOINTS.businessAdvancePaymentsChart(businessId),
      { params: toQueryParams({ year }) },
    );
    return response.data;
  },

  generateSchedule: async (
    businessId: number,
    year: number,
    periodMonthsCount: 1 | 2,
  ): Promise<{ created: number; skipped: number }> => {
    const response = await api.post<{ created: number; skipped: number }>(
      ADVANCE_PAYMENT_ENDPOINTS.advancePaymentsGenerate,
      { business_id: businessId, year, period_months_count: periodMonthsCount },
    );
    return response.data;
  },
};
