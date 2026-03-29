import { api } from "@/api/client";
import { DASHBOARD_ENDPOINTS } from "./endpoints";
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
      DASHBOARD_ENDPOINTS.dashboardOverview,
    );
    return response.data;
  },

  getSummary: async (): Promise<DashboardSummaryResponse> => {
    const response = await api.get<DashboardSummaryResponse>(
      DASHBOARD_ENDPOINTS.dashboardSummary,
    );
    return response.data;
  },

  getAttention: async (): Promise<AttentionResponse> => {
    const response = await api.get<AttentionResponse>(
      DASHBOARD_ENDPOINTS.dashboardAttention,
    );
    return response.data;
  },

  getWorkQueue: async (params: ListDashboardParams): Promise<WorkQueueResponse> => {
    const response = await api.get<WorkQueueResponse>(
      DASHBOARD_ENDPOINTS.dashboardWorkQueue,
      { params: toQueryParams(params) },
    );
    return response.data;
  },
};
