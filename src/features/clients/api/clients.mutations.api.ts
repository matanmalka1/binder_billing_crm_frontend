import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type {
  ClientResponse,
  CreateClientPayload,
  UpdateClientPayload,
  BusinessResponse,
  CreateBusinessPayload,
  UpdateBusinessPayload,
  BulkBusinessActionPayload,
  BulkBusinessActionResult,
} from "./contracts";

export const clientsMutationsApi = {
  create: async (payload: CreateClientPayload): Promise<ClientResponse> => {
    const response = await api.post<ClientResponse>(ENDPOINTS.clients, payload);
    return response.data;
  },

  update: async (clientId: number, payload: UpdateClientPayload): Promise<ClientResponse> => {
    const response = await api.patch<ClientResponse>(ENDPOINTS.clientById(clientId), payload);
    return response.data;
  },

  delete: async (clientId: number): Promise<void> => {
    await api.delete(ENDPOINTS.clientById(clientId));
  },

  restore: async (clientId: number): Promise<ClientResponse> => {
    const response = await api.post<ClientResponse>(ENDPOINTS.clientRestore(clientId));
    return response.data;
  },

  createBusiness: async (clientId: number, payload: CreateBusinessPayload): Promise<BusinessResponse> => {
    const response = await api.post<BusinessResponse>(`/clients/${clientId}/businesses`, payload);
    return response.data;
  },

  updateBusiness: async (businessId: number, payload: UpdateBusinessPayload): Promise<BusinessResponse> => {
    const response = await api.patch<BusinessResponse>(ENDPOINTS.businessById(businessId), payload);
    return response.data;
  },

  deleteBusiness: async (businessId: number): Promise<void> => {
    await api.delete(ENDPOINTS.businessById(businessId));
  },

  restoreBusiness: async (businessId: number): Promise<BusinessResponse> => {
    const response = await api.post<BusinessResponse>(ENDPOINTS.businessRestore(businessId));
    return response.data;
  },

  bulkBusinessAction: async (payload: BulkBusinessActionPayload): Promise<BulkBusinessActionResult> => {
    const response = await api.post<BulkBusinessActionResult>(ENDPOINTS.businessesBulkAction, payload);
    return response.data;
  },
};
