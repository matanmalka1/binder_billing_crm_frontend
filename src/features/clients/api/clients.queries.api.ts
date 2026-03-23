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
} from "./contracts";

export const clientsQueriesApi = {
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
};
