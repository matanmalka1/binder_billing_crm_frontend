import { api } from "@/api/client";
import { BINDER_ENDPOINTS } from "./endpoints";
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
    const response = await api.get<BinderListResponse>(BINDER_ENDPOINTS.binders, {
      params: toQueryParams(params),
    });
    return response.data;
  },

  getBinder: async (binderId: number): Promise<BinderResponse> => {
    const response = await api.get<BinderResponse>(BINDER_ENDPOINTS.binderById(binderId));
    return response.data;
  },

  receive: async (payload: ReceiveBinderPayload): Promise<BinderReceiveResult> => {
    const response = await api.post<BinderReceiveResult>(BINDER_ENDPOINTS.binderReceive, payload);
    return response.data;
  },

  ready: async (binderId: number): Promise<BinderResponse> => {
    const response = await api.post<BinderResponse>(BINDER_ENDPOINTS.binderReady(binderId));
    return response.data;
  },

  revertReady: async (binderId: number): Promise<BinderResponse> => {
    const response = await api.post<BinderResponse>(BINDER_ENDPOINTS.binderRevertReady(binderId));
    return response.data;
  },

  returnBinder: async (binderId: number, payload?: ReturnBinderPayload): Promise<BinderResponse> => {
    const response = await api.post<BinderResponse>(BINDER_ENDPOINTS.binderReturn(binderId), payload);
    return response.data;
  },

  getOpenBinders: async (params?: { page?: number; page_size?: number }): Promise<BinderListResponseExtended> => {
    const response = await api.get<BinderListResponseExtended>(BINDER_ENDPOINTS.bindersOpen, { params });
    return response.data;
  },

  listClientBinders: async (
    businessId: number,
    params: ListOperationalBindersParams,
  ): Promise<BinderExtendedListResponse> => {
    const response = await api.get<BinderExtendedListResponse>(BINDER_ENDPOINTS.businessBinders(businessId), {
      params: toQueryParams(params),
    });
    return response.data;
  },

  delete: async (binderId: number): Promise<void> => {
    await api.delete(BINDER_ENDPOINTS.binderById(binderId));
  },

  getHistory: async (binderId: number): Promise<BinderHistoryResponse> => {
    const response = await api.get<BinderHistoryResponse>(BINDER_ENDPOINTS.binderHistory(binderId));
    return response.data;
  },

  getIntakes: async (binderId: number): Promise<BinderIntakeListResponse> => {
    const response = await api.get<BinderIntakeListResponse>(BINDER_ENDPOINTS.binderIntakes(binderId));
    return response.data;
  },
};
