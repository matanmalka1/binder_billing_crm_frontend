import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { toQueryParams } from "@/api/queryParams";
import type {
  DashboardOverviewResponse,
  DashboardSummaryResponse,
  AttentionResponse,
  WorkQueueResponse,
  ListDashboardParams,
} from "./contracts";

export const dashboardApi = {
  getOverview: async (): Promise<DashboardOverviewResponse> => {
    const response = await api.get<DashboardOverviewResponse>(
      ENDPOINTS.dashboardOverview,
    );
    return response.data;
  },

  getSummary: async (): Promise<DashboardSummaryResponse> => {
    const response = await api.get<DashboardSummaryResponse>(
      ENDPOINTS.dashboardSummary,
    );
    return response.data;
  },

  getAttention: async (): Promise<AttentionResponse> => {
    const response = await api.get<AttentionResponse>(
      ENDPOINTS.dashboardAttention,
    );
    return response.data;
  },

  getWorkQueue: async (params: ListDashboardParams): Promise<WorkQueueResponse> => {
    const response = await api.get<WorkQueueResponse>(
      ENDPOINTS.dashboardWorkQueue,
      { params: toQueryParams(params) },
    );
    return response.data;
  },
};
