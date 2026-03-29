import { api } from "@/api/client";
import { TIMELINE_ENDPOINTS } from "./endpoints";
import { toQueryParams } from "@/api/queryParams";
import type { TimelineResponse, TimelineParams } from "./contracts";

export const timelineApi = {
  getClientTimeline: async (
    businessId: number,
    params: TimelineParams,
  ): Promise<TimelineResponse> => {
    const response = await api.get<TimelineResponse>(
      TIMELINE_ENDPOINTS.businessTimeline(businessId),
      { params: toQueryParams(params) },
    );
    return response.data;
  },
};
