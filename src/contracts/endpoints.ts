export const API_BASE_PATH = "/api/v1";

export const ENDPOINTS = {
  health: "/health",
  info: "/info",
  authLogin: "/auth/login",
  clients: "/clients",
  clientById: (clientId: number | string) => `/clients/${clientId}`,
  clientBinders: (clientId: number | string) => `/clients/${clientId}/binders`,
  clientTimeline: (clientId: number | string) => `/clients/${clientId}/timeline`,
  binders: "/binders",
  binderById: (binderId: number | string) => `/binders/${binderId}`,
  binderReady: (binderId: number | string) => `/binders/${binderId}/ready`,
  binderReturn: (binderId: number | string) => `/binders/${binderId}/return`,
  binderReceive: "/binders/receive",
  binderHistory: (binderId: number | string) => `/binders/${binderId}/history`,
  bindersOpen: "/binders/open",
  bindersOverdue: "/binders/overdue",
  bindersDueToday: "/binders/due-today",
  dashboardSummary: "/dashboard/summary",
  dashboardOverview: "/dashboard/overview",
  dashboardWorkQueue: "/dashboard/work-queue",
  dashboardAlerts: "/dashboard/alerts",
  dashboardAttention: "/dashboard/attention",
  search: "/search",
  charges: "/charges",
  chargeById: (chargeId: number | string) => `/charges/${chargeId}`,
  chargeIssue: (chargeId: number | string) => `/charges/${chargeId}/issue`,
  chargeMarkPaid: (chargeId: number | string) => `/charges/${chargeId}/mark-paid`,
  chargeCancel: (chargeId: number | string) => `/charges/${chargeId}/cancel`,
  documentsUpload: "/documents/upload",
  documentsByClient: (clientId: number | string) => `/documents/client/${clientId}`,
  documentSignalsByClient: (clientId: number | string) =>
    `/documents/client/${clientId}/signals`,
} as const;

export const ENDPOINT_TEMPLATES = {
  clientById: "/clients/{client_id}",
  clientBinders: "/clients/{client_id}/binders",
  clientTimeline: "/clients/{client_id}/timeline",
  binderById: "/binders/{binder_id}",
  binderReady: "/binders/{binder_id}/ready",
  binderReturn: "/binders/{binder_id}/return",
  binderHistory: "/binders/{binder_id}/history",
  chargeById: "/charges/{charge_id}",
  chargeIssue: "/charges/{charge_id}/issue",
  chargeMarkPaid: "/charges/{charge_id}/mark-paid",
  chargeCancel: "/charges/{charge_id}/cancel",
  documentsByClient: "/documents/client/{client_id}",
  documentSignalsByClient: "/documents/client/{client_id}/signals",
} as const;

export type EndpointTemplateKey = keyof typeof ENDPOINT_TEMPLATES;

export const endpointTemplate = (key: EndpointTemplateKey): string => ENDPOINT_TEMPLATES[key];
