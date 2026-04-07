import type { BackendAction } from "@/lib/actions/types";

export type AttentionItemType =
  | "unpaid_charge"
  | "unpaid_charges"
  | "ready_for_pickup";

export interface AttentionItem {
  item_type: AttentionItemType;
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
  active_clients: number;
  active_binders: number;
  binders_in_office: number;
  binders_ready_for_pickup: number;
  open_reminders: number;
  vat_due_this_month: number;
  quick_actions: BackendAction[];
  attention: AttentionResponse;
}

export interface DashboardSummaryResponse {
  total_clients: number;
  active_clients: number;
  binders_in_office: number;
  binders_ready_for_pickup: number;
  open_reminders: number;
  vat_due_this_month: number;
  attention: AttentionResponse;
}
