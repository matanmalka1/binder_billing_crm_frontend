import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { toQueryParams } from "@/api/queryParams";
import type {
  ClientResponse,
  ClientListResponse,
  ListClientsParams,
  ClientConflictInfo,
  BusinessResponse,
  BusinessListResponse,
  ClientBusinessesResponse,
  ListBusinessesParams,
  BusinessStatusCardResponse,
  CreateClientPayload,
  UpdateClientPayload,
  CreateBusinessPayload,
  UpdateBusinessPayload,
  BulkBusinessActionPayload,
  BulkBusinessActionResult,
} from "./contracts";

export const clientsApi = {
  // ── Queries ──────────────────────────────────────────────────────────────

  list: async (params: ListClientsParams): Promise<ClientListResponse> => {
    const response = await api.get<ClientListResponse>(ENDPOINTS.clients, {
      params: toQueryParams(params),
    });
    return response.data;
  },

  getById: async (clientId: number): Promise<ClientResponse> => {
    const response = await api.get<ClientResponse>(ENDPOINTS.clientById(clientId));
    return response.data;
  },

  getConflictByIdNumber: async (idNumber: string): Promise<ClientConflictInfo> => {
    const response = await api.get<ClientConflictInfo>(ENDPOINTS.clientConflictByIdNumber(idNumber));
    return response.data;
  },

  listBusinesses: async (params: ListBusinessesParams): Promise<BusinessListResponse> => {
    const response = await api.get<BusinessListResponse>(ENDPOINTS.businesses, {
      params: toQueryParams(params),
    });
    return response.data;
  },

  getBusinessById: async (businessId: number): Promise<BusinessResponse> => {
    const response = await api.get<BusinessResponse>(ENDPOINTS.businessById(businessId));
    return response.data;
  },

  listBusinessesForClient: async (
    clientId: number,
    params?: { page?: number; page_size?: number },
  ): Promise<ClientBusinessesResponse> => {
    const response = await api.get<ClientBusinessesResponse>(
      `/clients/${clientId}/businesses`,
      params ? { params: toQueryParams(params) } : undefined,
    );
    return response.data;
  },

  getStatusCard: async (businessId: number, year?: number): Promise<BusinessStatusCardResponse> => {
    const response = await api.get<BusinessStatusCardResponse>(
      ENDPOINTS.businessStatusCard(businessId),
      { params: year ? { year } : undefined },
    );
    return response.data;
  },

  // ── Mutations ────────────────────────────────────────────────────────────

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
