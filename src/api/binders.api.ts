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
} from "../features/binders/types";

export interface BinderDetailResponse {
  id: number;
  client_id: number;
  binder_number: string;
  status: string;
  received_at: string;
  returned_at: string | null;
  pickup_person_name: string | null;
  work_state: string | null;
  signals: string[];
}

export interface BinderListResponseExtended {
  items: BinderDetailResponse[];
  page: number;
  page_size: number;
  total: number;
}

export const bindersApi = {
  list: async (params: ListBindersParams): Promise<BinderListResponse> => {
    const response = await api.get<BinderListResponse>(ENDPOINTS.binders, {
      params: toQueryParams(params),
    });
    return response.data;
  },

  getBinder: async (binderId: number): Promise<BinderResponse> => {
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

  getOpenBinders: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<BinderListResponseExtended> => {
    const response = await api.get<BinderListResponseExtended>(
      ENDPOINTS.bindersOpen,
      { params },
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

  delete: async (binderId: number): Promise<void> => {
    await api.delete(ENDPOINTS.binderById(binderId));
  },

  getHistory: async (binderId: number): Promise<BinderHistoryResponse> => {
    const response = await api.get<BinderHistoryResponse>(
      ENDPOINTS.binderHistory(binderId),
    );
    return response.data;
  },
};
