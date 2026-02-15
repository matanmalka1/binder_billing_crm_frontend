import { ENDPOINTS } from "../contracts/endpoints";
import { toQueryParams } from "./queryParams";
import { api } from "./client";

export interface SearchResult {
  result_type: string;
  client_id: number;
  client_name: string;
  binder_id: number | null;
  binder_number: string | null;
  work_state?: string | null;
  sla_state?: string | null;
  signals?: string[] | null;
}

export interface SearchResponse {
  results: SearchResult[];
  page: number;
  page_size: number;
  total: number;
}

export interface SearchParams {
  query?: string;
  client_name?: string;
  id_number?: string;
  binder_number?: string;
  work_state?: string;
  sla_state?: string;
  signal_type?: string[];
  has_signals?: boolean;
  page?: number;
  page_size?: number;
}

export const searchApi = {
  search: async (params: SearchParams): Promise<SearchResponse> => {
    const response = await api.get<SearchResponse>(ENDPOINTS.search, {
      params: toQueryParams(params),
    });
    return response.data;
  },
};
