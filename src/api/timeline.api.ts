import type { BackendActionInput } from "../lib/actions/types";
import { ENDPOINTS } from "../contracts/endpoints";
import { toQueryParams } from "./queryParams";
import { api } from "./client";

export interface TimelineEvent {
  event_type: string;
  timestamp: string;
  binder_id: number | null;
  charge_id: number | null;
  description: string;
  metadata?: Record<string, unknown> | null;
  actions?: BackendActionInput[] | null;
  available_actions?: BackendActionInput[] | null;
}

export interface TimelineResponse {
  client_id: number;
  events: TimelineEvent[];
  page: number;
  page_size: number;
  total: number;
}

export interface TimelineParams {
  page?: number;
  page_size?: number;
}

export const timelineApi = {
  getClientTimeline: async (
    clientId: number,
    params: TimelineParams,
  ): Promise<TimelineResponse> => {
    const response = await api.get<TimelineResponse>(ENDPOINTS.clientTimeline(clientId), {
      params: toQueryParams(params),
    });
    return response.data;
  },
};
