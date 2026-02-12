import type { AttentionItem, AttentionResponse } from "../../api/dashboard.api";
import type { BackendQuickAction } from "../actions/types";

export type { AttentionItem, AttentionResponse };

export type DashboardQuickAction = BackendQuickAction;

export interface DashboardAdvisorData {
  role_view: "advisor";
  total_clients: number;
  active_binders: number;
  overdue_binders: number;
  binders_due_today: number;
  binders_due_this_week: number;
  work_state?: string | null;
  sla_state?: string | null;
  signals?: string[] | null;
  quick_actions?: DashboardQuickAction[] | null;
}

export interface DashboardSecretaryData {
  role_view: "secretary";
  binders_in_office: number;
  binders_ready_for_pickup: number;
  binders_overdue: number;
}

export type DashboardData = DashboardAdvisorData | DashboardSecretaryData;
