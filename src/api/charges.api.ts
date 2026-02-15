import type { PaginatedResponse } from "../types/common";
import { ENDPOINTS } from "../contracts/endpoints";
import { toQueryParams } from "./queryParams";
import { api } from "./client";

export interface ChargeBase {
  id: number;
  client_id: number;
  charge_type: string;
  period: string | null;
  status: string;
  created_at: string;
  issued_at: string | null;
  paid_at: string | null;
}

export interface ChargeAdvisorResponse extends ChargeBase {
  amount: number;
  currency: string;
}

export interface ChargeSecretaryResponse extends ChargeBase {
  amount?: never;
  currency?: never;
}

export type ChargeResponse = ChargeAdvisorResponse | ChargeSecretaryResponse;
export type ChargesListResponse = PaginatedResponse<ChargeResponse>;

export interface ChargesListParams {
  client_id?: number;
  status?: string;
  page?: number;
  page_size?: number;
}

export interface CreateChargePayload {
  client_id: number;
  amount: number;
  charge_type: "retainer" | "one_time";
  period?: string | null;
  currency?: string;
}

export const isAdvisorCharge = (
  charge: ChargeResponse,
): charge is ChargeAdvisorResponse => {
  return "amount" in charge && typeof charge.amount === "number";
};

export const chargesApi = {
  list: async (params: ChargesListParams): Promise<ChargesListResponse> => {
    const response = await api.get<ChargesListResponse>(ENDPOINTS.charges, {
      params: toQueryParams(params),
    });
    return response.data;
  },

  getById: async (chargeId: number): Promise<ChargeResponse> => {
    const response = await api.get<ChargeResponse>(ENDPOINTS.chargeById(chargeId));
    return response.data;
  },

  create: async (payload: CreateChargePayload): Promise<ChargeAdvisorResponse> => {
    const response = await api.post<ChargeAdvisorResponse>(ENDPOINTS.charges, payload);
    return response.data;
  },

  issue: async (chargeId: number): Promise<ChargeAdvisorResponse> => {
    const response = await api.post<ChargeAdvisorResponse>(ENDPOINTS.chargeIssue(chargeId));
    return response.data;
  },

  markPaid: async (chargeId: number): Promise<ChargeAdvisorResponse> => {
    const response = await api.post<ChargeAdvisorResponse>(
      ENDPOINTS.chargeMarkPaid(chargeId),
    );
    return response.data;
  },

  cancel: async (chargeId: number): Promise<ChargeAdvisorResponse> => {
    const response = await api.post<ChargeAdvisorResponse>(ENDPOINTS.chargeCancel(chargeId));
    return response.data;
  },
};
