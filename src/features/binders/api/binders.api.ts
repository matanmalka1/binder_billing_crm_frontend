import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { toQueryParams } from "@/api/queryParams";
import type {
  BinderExtendedListResponse,
  BinderHistoryResponse,
  BinderIntakeListResponse,
  BinderListResponse,
  BinderReceiveResult,
  BinderResponse,
  ListBindersParams,
  ListOperationalBindersParams,
  ReceiveBinderPayload,
  ReturnBinderPayload,
} from "../types";
import type { BinderListResponseExtended } from "./contracts";

export const bindersApi = {
  list: async (params: ListBindersParams): Promise<BinderListResponse> => {
    const response = await api.get<BinderListResponse>(ENDPOINTS.binders, {
      params: toQueryParams(params),
    });
    return response.data;
  },

  getBinder: async (binderId: number): Promise<BinderResponse> => {
    const response = await api.get<BinderResponse>(ENDPOINTS.binderById(binderId));
    return response.data;
  },

  receive: async (payload: ReceiveBinderPayload): Promise<BinderReceiveResult> => {
    const response = await api.post<BinderReceiveResult>(ENDPOINTS.binderReceive, payload);
    return response.data;
  },

  ready: async (binderId: number): Promise<BinderResponse> => {
    const response = await api.post<BinderResponse>(ENDPOINTS.binderReady(binderId));
    return response.data;
  },

  revertReady: async (binderId: number): Promise<BinderResponse> => {
    const response = await api.post<BinderResponse>(ENDPOINTS.binderRevertReady(binderId));
    return response.data;
  },

  returnBinder: async (binderId: number, payload?: ReturnBinderPayload): Promise<BinderResponse> => {
    const response = await api.post<BinderResponse>(ENDPOINTS.binderReturn(binderId), payload);
    return response.data;
  },

  getOpenBinders: async (params?: { page?: number; page_size?: number }): Promise<BinderListResponseExtended> => {
    const response = await api.get<BinderListResponseExtended>(ENDPOINTS.bindersOpen, { params });
    return response.data;
  },

  listClientBinders: async (
    businessId: number,
    params: ListOperationalBindersParams,
  ): Promise<BinderExtendedListResponse> => {
    const response = await api.get<BinderExtendedListResponse>(ENDPOINTS.businessBinders(businessId), {
      params: toQueryParams(params),
    });
    return response.data;
  },

  delete: async (binderId: number): Promise<void> => {
    await api.delete(ENDPOINTS.binderById(binderId));
  },

  getHistory: async (binderId: number): Promise<BinderHistoryResponse> => {
    const response = await api.get<BinderHistoryResponse>(ENDPOINTS.binderHistory(binderId));
    return response.data;
  },

  getIntakes: async (binderId: number): Promise<BinderIntakeListResponse> => {
    const response = await api.get<BinderIntakeListResponse>(ENDPOINTS.binderIntakes(binderId));
    return response.data;
  },
};
