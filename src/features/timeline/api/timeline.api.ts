import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { toQueryParams } from "@/api/queryParams";
import type { TimelineResponse, TimelineParams } from "./contracts";

export const timelineApi = {
  getClientTimeline: async (
    clientId: number,
    params: TimelineParams,
  ): Promise<TimelineResponse> => {
    const response = await api.get<TimelineResponse>(
      ENDPOINTS.businessTimeline(clientId),
      { params: toQueryParams(params) },
    );
    return response.data;
  },
};
