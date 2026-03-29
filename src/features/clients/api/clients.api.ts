import { api } from "@/api/client";
import { BUSINESS_ENDPOINTS } from "@/features/businesses/api/endpoints";
import { toQueryParams } from "@/api/queryParams";
import { CLIENT_ENDPOINTS } from "./endpoints";
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
    const response = await api.get<ClientListResponse>(CLIENT_ENDPOINTS.clients, {
      params: toQueryParams(params),
    });
    return response.data;
  },

  getById: async (clientId: number): Promise<ClientResponse> => {
    const response = await api.get<ClientResponse>(CLIENT_ENDPOINTS.clientById(clientId));
    return response.data;
  },

  getConflictByIdNumber: async (idNumber: string): Promise<ClientConflictInfo> => {
    const response = await api.get<ClientConflictInfo>(CLIENT_ENDPOINTS.clientConflictByIdNumber(idNumber));
    return response.data;
  },

  listBusinesses: async (params: ListBusinessesParams): Promise<BusinessListResponse> => {
    const response = await api.get<BusinessListResponse>(BUSINESS_ENDPOINTS.businesses, {
      params: toQueryParams(params),
    });
    return response.data;
  },

  getBusinessById: async (businessId: number): Promise<BusinessResponse> => {
    const response = await api.get<BusinessResponse>(BUSINESS_ENDPOINTS.businessById(businessId));
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
      BUSINESS_ENDPOINTS.businessStatusCard(businessId),
      { params: year ? { year } : undefined },
    );
    return response.data;
  },

  // ── Mutations ────────────────────────────────────────────────────────────

  create: async (payload: CreateClientPayload): Promise<ClientResponse> => {
    const response = await api.post<ClientResponse>(CLIENT_ENDPOINTS.clients, payload);
    return response.data;
  },

  update: async (clientId: number, payload: UpdateClientPayload): Promise<ClientResponse> => {
    const response = await api.patch<ClientResponse>(CLIENT_ENDPOINTS.clientById(clientId), payload);
    return response.data;
  },

  delete: async (clientId: number): Promise<void> => {
    await api.delete(CLIENT_ENDPOINTS.clientById(clientId));
  },

  restore: async (clientId: number): Promise<ClientResponse> => {
    const response = await api.post<ClientResponse>(CLIENT_ENDPOINTS.clientRestore(clientId));
    return response.data;
  },

  createBusiness: async (clientId: number, payload: CreateBusinessPayload): Promise<BusinessResponse> => {
    const response = await api.post<BusinessResponse>(`/clients/${clientId}/businesses`, payload);
    return response.data;
  },

  updateBusiness: async (businessId: number, payload: UpdateBusinessPayload): Promise<BusinessResponse> => {
    const response = await api.patch<BusinessResponse>(BUSINESS_ENDPOINTS.businessById(businessId), payload);
    return response.data;
  },

  deleteBusiness: async (businessId: number): Promise<void> => {
    await api.delete(BUSINESS_ENDPOINTS.businessById(businessId));
  },

  restoreBusiness: async (businessId: number): Promise<BusinessResponse> => {
    const response = await api.post<BusinessResponse>(BUSINESS_ENDPOINTS.businessRestore(businessId));
    return response.data;
  },

  bulkBusinessAction: async (payload: BulkBusinessActionPayload): Promise<BulkBusinessActionResult> => {
    const response = await api.post<BulkBusinessActionResult>(BUSINESS_ENDPOINTS.businessesBulkAction, payload);
    return response.data;
  },
};
