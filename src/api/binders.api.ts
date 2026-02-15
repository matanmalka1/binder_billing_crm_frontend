import { ENDPOINTS } from "./endpoints";
import { toQueryParams } from "./queryParams";
import { api } from "./client";
import type {
  BinderExtendedListResponse,
  BinderHistoryResponse,
  BinderListResponse,
  BinderResponse,
  ListBindersParams,
  ListOperationalBindersParams,
  ReceiveBinderPayload,
  ReturnBinderPayload,
} from "./binders.types";

export const bindersApi = {
  list: async (params: ListBindersParams): Promise<BinderListResponse> => {
    const response = await api.get<BinderListResponse>(ENDPOINTS.binders, {
      params: toQueryParams(params),
    });
    return response.data;
  },

  getById: async (binderId: number): Promise<BinderResponse> => {
    const response = await api.get<BinderResponse>(
      ENDPOINTS.binderById(binderId),
    );
    return response.data;
  },

  receive: async (payload: ReceiveBinderPayload): Promise<BinderResponse> => {
    const response = await api.post<BinderResponse>(
      ENDPOINTS.binderReceive,
      payload,
    );
    return response.data;
  },

  ready: async (binderId: number): Promise<BinderResponse> => {
    const response = await api.post<BinderResponse>(
      ENDPOINTS.binderReady(binderId),
    );
    return response.data;
  },

  returnBinder: async (
    binderId: number,
    payload?: ReturnBinderPayload,
  ): Promise<BinderResponse> => {
    const response = await api.post<BinderResponse>(
      ENDPOINTS.binderReturn(binderId),
      payload,
    );
    return response.data;
  },

  listOpen: async (
    params: ListOperationalBindersParams,
  ): Promise<BinderExtendedListResponse> => {
    const response = await api.get<BinderExtendedListResponse>(
      ENDPOINTS.bindersOpen,
      {
        params: toQueryParams(params),
      },
    );
    return response.data;
  },

  listOverdue: async (
    params: ListOperationalBindersParams,
  ): Promise<BinderExtendedListResponse> => {
    const response = await api.get<BinderExtendedListResponse>(
      ENDPOINTS.bindersOverdue,
      {
        params: toQueryParams(params),
      },
    );
    return response.data;
  },

  listDueToday: async (
    params: ListOperationalBindersParams,
  ): Promise<BinderExtendedListResponse> => {
    const response = await api.get<BinderExtendedListResponse>(
      ENDPOINTS.bindersDueToday,
      {
        params: toQueryParams(params),
      },
    );
    return response.data;
  },

  listClientBinders: async (
    clientId: number,
    params: ListOperationalBindersParams,
  ): Promise<BinderExtendedListResponse> => {
    const response = await api.get<BinderExtendedListResponse>(
      ENDPOINTS.clientBinders(clientId),
      {
        params: toQueryParams(params),
      },
    );
    return response.data;
  },

  getHistory: async (binderId: number): Promise<BinderHistoryResponse> => {
    const response = await api.get<BinderHistoryResponse>(
      ENDPOINTS.binderHistory(binderId),
    );
    return response.data;
  },
};
