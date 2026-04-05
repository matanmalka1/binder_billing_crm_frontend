import type { BackendAction } from "@/lib/actions/types";
import type { PaginatedResponse } from "@/types";

export interface AttentionItem {
  item_type: string;
  binder_id: number | null;
  client_id: number | null;
  business_id: number | null;
  client_name: string | null;
  description: string;
}

export interface AttentionResponse {
  items: AttentionItem[];
  total: number;
}

export interface DashboardOverviewResponse {
  total_clients: number;
  active_binders: number;
  open_reminders: number;
  vat_due_this_month: number;
  quick_actions: BackendAction[];
  attention: AttentionResponse;
}

export interface DashboardSummaryResponse {
  binders_in_office: number;
  binders_ready_for_pickup: number;
  open_reminders: number;
  vat_due_this_month: number;
  attention: AttentionResponse;
}

export interface WorkQueueItem {
  binder_id: number;
  client_id: number;
  business_id: number;
  client_name: string;
  binder_number: string;
  days_since_received: number;
}

export type WorkQueueResponse = PaginatedResponse<WorkQueueItem>;

export interface ListDashboardParams {
  page?: number;
  page_size?: number;
}
