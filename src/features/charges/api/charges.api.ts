import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { toQueryParams } from "@/api/queryParams";
import type {
  ChargeResponse,
  ChargeAdvisorResponse,
  ChargesListResponse,
  ChargesListParams,
  CreateChargePayload,
  BulkChargeActionPayload,
  BulkChargeActionResult,
} from "./contracts";

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
    const response = await api.post<ChargeAdvisorResponse>(ENDPOINTS.chargeMarkPaid(chargeId));
    return response.data;
  },

  cancel: async (chargeId: number, reason?: string): Promise<ChargeAdvisorResponse> => {
    const response = await api.post<ChargeAdvisorResponse>(
      ENDPOINTS.chargeCancel(chargeId),
      reason ? { reason } : undefined,
    );
    return response.data;
  },

  delete: async (chargeId: number): Promise<void> => {
    await api.delete(ENDPOINTS.chargeById(chargeId));
  },

  bulkAction: async (payload: BulkChargeActionPayload): Promise<BulkChargeActionResult> => {
    const response = await api.post<BulkChargeActionResult>(ENDPOINTS.chargesBulkAction, payload);
    return response.data;
  },
};
