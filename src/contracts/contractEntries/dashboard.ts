import { ENDPOINTS } from "../endpoints";
import type { EndpointContract } from "../types";

export const DASHBOARD_CONTRACT_ENTRIES: EndpointContract[] = [
  {
    key: "dashboard.summary",
    method: "GET",
    path: ENDPOINTS.dashboardSummary,
    role: "advisor_or_secretary",
  },
  {
    key: "dashboard.overview",
    method: "GET",
    path: ENDPOINTS.dashboardOverview,
    role: "advisor",
  },
  {
    key: "dashboard.workQueue",
    method: "GET",
    path: ENDPOINTS.dashboardWorkQueue,
    role: "advisor_or_secretary",
    query: ["page", "page_size"],
  },
  {
    key: "dashboard.alerts",
    method: "GET",
    path: ENDPOINTS.dashboardAlerts,
    role: "advisor_or_secretary",
  },
  {
    key: "dashboard.attention",
    method: "GET",
    path: ENDPOINTS.dashboardAttention,
    role: "advisor_or_secretary",
  },
];
