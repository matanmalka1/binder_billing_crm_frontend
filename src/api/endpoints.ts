export const API_BASE_PATH = "/api/v1";

export const ENDPOINTS = {
  health: "/health",
  info: "/info",
  authLogin: "/auth/login",
  authLogout: "/auth/logout",
  clients: "/clients",
  clientById: (clientId: number | string) => `/clients/${clientId}`,
  clientBinders: (clientId: number | string) => `/clients/${clientId}/binders`,
  clientTimeline: (clientId: number | string) =>
    `/clients/${clientId}/timeline`,
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
  chargeMarkPaid: (chargeId: number | string) =>
    `/charges/${chargeId}/mark-paid`,
  chargeCancel: (chargeId: number | string) => `/charges/${chargeId}/cancel`,
  documentsUpload: "/documents/upload",
  documentsByClient: (clientId: number | string) =>
    `/documents/client/${clientId}`,
  documentSignalsByClient: (clientId: number | string) =>
    `/documents/client/${clientId}/signals`,
  annualReports: "/annual-reports",
  annualReportById: (id: number | string) => `/annual-reports/${id}`,
  annualReportTransition: (id: number | string) =>
    `/annual-reports/${id}/transition`,
  annualReportSubmit: (id: number | string) => `/annual-reports/${id}/submit`,
  annualReportsKanban: "/annual-reports/kanban/view",
  annualReportAddSchedule: (id: number | string) =>
    `/annual-reports/${id}/schedules`,
  taxDeadlines: "/tax-deadlines",
  taxDeadlineById: (id: number | string) => `/tax-deadlines/${id}`,
  taxDeadlineComplete: (id: number | string) => `/tax-deadlines/${id}/complete`,
  taxDeadlinesDashboard: "/tax-deadlines/dashboard/urgent",
  clientAuthorityContacts: (clientId: number | string) =>
    `/clients/${clientId}/authority-contacts`,
  authorityContactById: (id: number | string) =>
    `/clients/authority-contacts/${id}`,
  clientTaxProfile: (clientId: number | string) =>
    `/clients/${clientId}/tax-profile`,
  clientSignatureRequests: (clientId: number | string) =>
    `/clients/${clientId}/signature-requests`,
  clientsExport: "/clients/export",
  clientsTemplate: "/clients/template",
  clientsImport: "/clients/import",
  signatureRequests: "/signature-requests",
  signatureRequestsPending: "/signature-requests/pending",
  signatureRequestById: (id: number | string) => `/signature-requests/${id}`,
  signatureRequestSend: (id: number | string) =>
    `/signature-requests/${id}/send`,
  signatureRequestCancel: (id: number | string) =>
    `/signature-requests/${id}/cancel`,
  signatureRequestAuditTrail: (id: number | string) =>
    `/signature-requests/${id}/audit-trail`,
  users: "/users",
  userById: (id: number | string) => `/users/${id}`,
  userActivate: (id: number | string) => `/users/${id}/activate`,
  userDeactivate: (id: number | string) => `/users/${id}/deactivate`,
  userResetPassword: (id: number | string) => `/users/${id}/reset-password`,
  dashboardTaxSubmissions: "/dashboard/tax-submissions",
  reportsAging: "/reports/aging",
  reportsAgingExport: "/reports/aging/export",
  reminders: "/reminders",
  reminderById: (id: number) => `/reminders/${id}`,
  reminderCancel: (id: number) => `/reminders/${id}/cancel`,
  reminderMarkSent: (id: number) => `/reminders/${id}/mark-sent`,
} as const;
