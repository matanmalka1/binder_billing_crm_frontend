import type { BackendAction } from "@/lib/actions/types";

export type AttentionItemType =
  | "unpaid_charge"
  | "unpaid_charges"
  | "ready_for_pickup";

interface BaseAttentionItem {
  item_type: AttentionItemType;
  binder_id: number | null;
  client_id: number | null;
  business_id: number | null;
  client_name: string | null;
  description: string;
}

export interface UnpaidChargeAttentionItem extends BaseAttentionItem {
  item_type: "unpaid_charge";
  business_name: string | null;
  charge_subject: string;
  charge_date: string | null;
  charge_amount: string;
  charge_invoice_number: string;
  charge_period: string | null;
}

export interface UnpaidChargesAttentionItem extends BaseAttentionItem {
  item_type: "unpaid_charges";
}

export interface ReadyForPickupAttentionItem extends BaseAttentionItem {
  item_type: "ready_for_pickup";
}

export type AttentionItem =
  | UnpaidChargeAttentionItem
  | UnpaidChargesAttentionItem
  | ReadyForPickupAttentionItem;

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
  vat_stats: VatDashboardStats;
  quick_actions: BackendAction[];
  attention: AttentionResponse;
}

export interface DashboardSummaryResponse {
  total_clients: number;
  active_clients: number;
  active_binders: number;
  binders_in_office: number;
  binders_ready_for_pickup: number;
  open_reminders: number;
  vat_stats: VatDashboardStats;
  attention: AttentionResponse;
}

export interface VatDashboardPeriodStat {
  period: string;
  period_label: string;
  submitted: number;
  required: number;
  pending: number;
  completion_percent: number;
}

export interface VatDashboardStats {
  monthly: VatDashboardPeriodStat;
  bimonthly: VatDashboardPeriodStat;
}
