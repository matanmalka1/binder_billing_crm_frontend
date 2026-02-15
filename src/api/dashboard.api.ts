import type { BackendAction } from "../lib/actions/types";
import { ENDPOINTS } from "./endpoints";
import type { PaginatedResponse } from "../types/common";
import { toQueryParams } from "./queryParams";
import { api } from "./client";

export interface DashboardOverviewResponse {
  total_clients: number;
  active_binders: number;
  overdue_binders: number;
  binders_due_today: number;
  binders_due_this_week: number;
  work_state?: string | null;
  sla_state?: string | null;
  signals?: string[] | null;
  quick_actions?: BackendAction[] | null;
  attention: AttentionResponse;
}

export interface DashboardSummaryResponse {
  binders_in_office: number;
  binders_ready_for_pickup: number;
  binders_overdue: number;
  attention: AttentionResponse;
}

export interface AttentionItem {
  item_type: string;
  binder_id: number | null;
  client_id: number | null;
  client_name: string | null;
  description: string;
}

export interface AttentionResponse {
  items: AttentionItem[];
  total: number;
}

export interface AlertItem {
  binder_id: number;
  client_id: number;
  client_name: string;
  binder_number: string;
  alert_type: string;
  days_overdue: number | null;
  days_remaining: number | null;
}

export interface AlertsResponse {
  items: AlertItem[];
  total: number;
}

export interface WorkQueueItem {
  binder_id: number;
  client_id: number;
  client_name: string;
  binder_number: string;
  work_state: string;
  signals: string[];
  days_since_received: number;
  expected_return_at: string;
}

export type WorkQueueResponse = PaginatedResponse<WorkQueueItem>;

export interface ListDashboardParams {
  page?: number;
  page_size?: number;
}

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

  getAlerts: async (): Promise<AlertsResponse> => {
    const response = await api.get<AlertsResponse>(ENDPOINTS.dashboardAlerts);
    return response.data;
  },

  getWorkQueue: async (
    params: ListDashboardParams,
  ): Promise<WorkQueueResponse> => {
    const response = await api.get<WorkQueueResponse>(
      ENDPOINTS.dashboardWorkQueue,
      {
        params: toQueryParams(params),
      },
    );
    return response.data;
  },
};
