import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { toQueryParams } from "@/api/queryParams";
import type { SearchParams, SearchResponse } from "./contracts";

export const searchApi = {
  search: async (params: SearchParams): Promise<SearchResponse> => {
    const { signal_type, ...rest } = params;
    const queryParams = toQueryParams(rest);

    if (Array.isArray(signal_type)) {
      signal_type.forEach((signal) => {
        if (signal && signal.trim().length > 0) {
          queryParams.append("signal_type", signal);
        }
      });
    }

    const response = await api.get<SearchResponse>(ENDPOINTS.search, {
      params: queryParams,
    });
    return response.data;
  },
};
