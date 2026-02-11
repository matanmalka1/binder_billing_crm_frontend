import type { DashboardQuickActionRequest } from "../../api/client";

export type DashboardQuickAction = {
  key?: string;
  endpoint?: string;
  method?: DashboardQuickActionRequest["method"];
  payload?: Record<string, unknown>;
};

export type DashboardQuickActionWithEndpoint = DashboardQuickAction & {
  endpoint: string;
};

export type DashboardData = {
  total_clients: number;
  active_binders: number;
  overdue_binders: number;
  binders_due_today: number;
  binders_due_this_week: number;
  work_state?: string | null;
  sla_state?: string | null;
  signals?: string[] | null;
  quick_actions?: DashboardQuickAction[] | null;
};
