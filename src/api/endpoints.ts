export const ENDPOINTS = {
  health: "/health",
  info: "/info",
  authLogin: "/auth/login",
  authLogout: "/auth/logout",

  // ── Clients (identity only) ───────────────────────────────────────────────
  clients: "/clients",
  clientById: (clientId: number | string) => `/clients/${clientId}`,
  clientRestore: (clientId: number | string) => `/clients/${clientId}/restore`,
  clientConflictByIdNumber: (idNumber: string) => `/clients/conflict/${idNumber}`,
  clientsExport: "/clients/export",
  clientsTemplate: "/clients/template",
  clientsImport: "/clients/import",

  // ── Businesses ────────────────────────────────────────────────────────────
  businesses: "/businesses",
  businessById: (businessId: number | string) => `/businesses/${businessId}`,
  businessRestore: (businessId: number | string) => `/businesses/${businessId}/restore`,
  businessesBulkAction: "/businesses/bulk-action",
  businessStatusCard: (businessId: number | string) => `/businesses/${businessId}/status-card`,
  businessTaxProfile: (businessId: number | string) => `/businesses/${businessId}/tax-profile`,
  businessBinders: (businessId: number | string) => `/businesses/${businessId}/binders`,

  // ── Binders ───────────────────────────────────────────────────────────────
  binders: "/binders",
  binderById: (binderId: number | string) => `/binders/${binderId}`,
  binderReady: (binderId: number | string) => `/binders/${binderId}/ready`,
  binderRevertReady: (binderId: number | string) => `/binders/${binderId}/revert-ready`,
  binderReturn: (binderId: number | string) => `/binders/${binderId}/return`,
  binderReceive: "/binders/receive",
  binderHistory: (binderId: number | string) => `/binders/${binderId}/history`,
  binderIntakes: (binderId: number | string) => `/binders/${binderId}/intakes`,
  bindersOpen: "/binders/open",

  // ── Dashboard ─────────────────────────────────────────────────────────────
  dashboardSummary: "/dashboard/summary",
  dashboardOverview: "/dashboard/overview",
  dashboardWorkQueue: "/dashboard/work-queue",
  dashboardAttention: "/dashboard/attention",
  dashboardTaxSubmissions: "/dashboard/tax-submissions",

  // ── Search ────────────────────────────────────────────────────────────────
  search: "/search",

  // ── Charges ───────────────────────────────────────────────────────────────
  charges: "/charges",
  chargeById: (chargeId: number | string) => `/charges/${chargeId}`,
  chargeIssue: (chargeId: number | string) => `/charges/${chargeId}/issue`,
  chargeMarkPaid: (chargeId: number | string) => `/charges/${chargeId}/mark-paid`,
  chargeCancel: (chargeId: number | string) => `/charges/${chargeId}/cancel`,
  chargesBulkAction: "/charges/bulk-action",

  // ── Documents ─────────────────────────────────────────────────────────────
  documentsUpload: "/documents/upload",
  documentsByBusiness: (businessId: number | string) => `/documents/business/${businessId}`,
  documentSignalsByBusiness: (businessId: number | string) => `/documents/business/${businessId}/signals`,
  documentVersionsByBusiness: (businessId: number | string) => `/documents/business/${businessId}/versions`,
  documentsByAnnualReport: (reportId: number | string) => `/documents/annual-report/${reportId}`,
  documentById: (id: number | string) => `/documents/${id}`,
  documentReplace: (id: number | string) => `/documents/${id}/replace`,
  documentDownloadUrl: (id: number | string) => `/documents/${id}/download-url`,
  documentApprove: (id: number | string) => `/documents/${id}/approve`,
  documentReject: (id: number | string) => `/documents/${id}/reject`,
  documentNotes: (id: number | string) => `/documents/${id}/notes`,

  // ── Annual Reports ────────────────────────────────────────────────────────
  annualReports: "/annual-reports",
  annualReportById: (id: number | string) => `/annual-reports/${id}`,
  annualReportTransition: (id: number | string) => `/annual-reports/${id}/transition`,
  annualReportSubmit: (id: number | string) => `/annual-reports/${id}/submit`,
  annualReportTransitionStatus: (id: number | string) => `/annual-reports/${id}/status`,
  annualReportDeadline: (id: number | string) => `/annual-reports/${id}/deadline`,
  annualReportSchedules: (id: number | string) => `/annual-reports/${id}/schedules`,
  annualReportSchedulesComplete: (id: number | string) => `/annual-reports/${id}/schedules/complete`,
  annualReportHistory: (id: number | string) => `/annual-reports/${id}/history`,
  annualReportDetails: (id: number | string) => `/annual-reports/${id}/details`,
  annualReportAmend: (id: number | string) => `/annual-reports/${id}/amend`,
  annualReportExportPdf: (id: number | string) => `/annual-reports/${id}/export/pdf`,
  annualReportFinancials: (id: number | string) => `/annual-reports/${id}/financials`,
  annualReportReadiness: (id: number | string) => `/annual-reports/${id}/readiness`,
  annualReportTaxCalculation: (id: number | string) => `/annual-reports/${id}/tax-calculation`,
  annualReportAdvancesSummary: (id: number | string) => `/annual-reports/${id}/advances-summary`,
  annualReportIncome: (id: number | string) => `/annual-reports/${id}/income`,
  annualReportIncomeById: (id: number | string, lineId: number | string) =>
    `/annual-reports/${id}/income/${lineId}`,
  annualReportExpenses: (id: number | string) => `/annual-reports/${id}/expenses`,
  annualReportExpenseById: (id: number | string, lineId: number | string) =>
    `/annual-reports/${id}/expenses/${lineId}`,
  annualReportAnnex: (id: number | string, schedule: string) =>
    `/annual-reports/${id}/annex/${schedule}`,
  annualReportAnnexLine: (
    id: number | string,
    schedule: string,
    lineId: number | string,
  ) => `/annual-reports/${id}/annex/${schedule}/${lineId}`,
  annualReportsKanban: "/annual-reports/kanban/view",
  annualReportOverdue: "/annual-reports/overdue",
  businessAnnualReports: (businessId: number | string) => `/businesses/${businessId}/annual-reports`,
  clientAnnualReports: (businessId: number | string) => `/businesses/${businessId}/annual-reports`,
  taxYearSummary: (taxYear: number | string) => `/tax-year/${taxYear}/summary`,
  taxYearReports: (taxYear: number | string) => `/tax-year/${taxYear}/reports`,

  // ── Tax Deadlines ─────────────────────────────────────────────────────────
  taxDeadlines: "/tax-deadlines",
  taxDeadlineById: (id: number | string) => `/tax-deadlines/${id}`,
  taxDeadlineComplete: (id: number | string) => `/tax-deadlines/${id}/complete`,
  taxDeadlinesDashboard: "/tax-deadlines/dashboard/urgent",
  taxDeadlinesTimeline: "/tax-deadlines/timeline",
  taxDeadlinesGenerate: "/tax-deadlines/generate",

  // ── Advance Payments ──────────────────────────────────────────────────────
  businessAdvancePayments: (businessId: number | string) =>
    `/businesses/${businessId}/advance-payments`,
  businessAdvancePaymentById: (businessId: number | string, id: number | string) =>
    `/businesses/${businessId}/advance-payments/${id}`,
  businessAdvancePaymentSuggest: (businessId: number | string) =>
    `/businesses/${businessId}/advance-payments/suggest`,
  businessAdvancePaymentsKPI: (businessId: number | string) =>
    `/businesses/${businessId}/advance-payments/kpi`,
  businessAdvancePaymentsChart: (businessId: number | string) =>
    `/businesses/${businessId}/advance-payments/chart`,
  // Standalone (not business-scoped)
  advancePaymentsOverview: "/advance-payments/overview",
  advancePaymentsGenerate: "/advance-payments/generate",

  // ── VAT ───────────────────────────────────────────────────────────────────
  vatWorkItemLookup: "/vat/work-items/lookup",
  vatWorkItems: "/vat/work-items",
  vatWorkItemById: (id: number | string) => `/vat/work-items/${id}`,
  vatWorkItemsByBusiness: (businessId: number | string) =>
    `/vat/businesses/${businessId}/work-items`,
  vatWorkItemMaterialsComplete: (id: number | string) =>
    `/vat/work-items/${id}/materials-complete`,
  vatWorkItemInvoices: (id: number | string) => `/vat/work-items/${id}/invoices`,
  vatWorkItemInvoiceById: (id: number | string, invoiceId: number | string) =>
    `/vat/work-items/${id}/invoices/${invoiceId}`,
  vatWorkItemReadyForReview: (id: number | string) =>
    `/vat/work-items/${id}/ready-for-review`,
  vatWorkItemSendBack: (id: number | string) => `/vat/work-items/${id}/send-back`,
  vatWorkItemFile: (id: number | string) => `/vat/work-items/${id}/file`,
  vatWorkItemAudit: (id: number | string) => `/vat/work-items/${id}/audit`,
  vatBusinessSummary: (businessId: number | string) =>
    `/vat/businesses/${businessId}/summary`,
  vatBusinessExport: (businessId: number | string) =>
    `/vat/businesses/${businessId}/export`,

  // ── Authority Contacts ────────────────────────────────────────────────────
  businessAuthorityContacts: (businessId: number | string) =>
    `/businesses/${businessId}/authority-contacts`,
  authorityContactById: (id: number | string) =>
    `/businesses/authority-contacts/${id}`,

  // ── Correspondence ────────────────────────────────────────────────────────
  correspondenceList: (businessId: number | string) =>
    `/businesses/${businessId}/correspondence`,
  correspondenceById: (businessId: number | string, id: number | string) =>
    `/businesses/${businessId}/correspondence/${id}`,

  // ── Timeline ──────────────────────────────────────────────────────────────
  businessTimeline: (businessId: number | string) =>
    `/businesses/${businessId}/timeline`,

  // ── Signature Requests ────────────────────────────────────────────────────
  signatureRequests: "/signature-requests",
  signatureRequestsPending: "/signature-requests/pending",
  signatureRequestById: (id: number | string) => `/signature-requests/${id}`,
  signatureRequestSend: (id: number | string) => `/signature-requests/${id}/send`,
  signatureRequestCancel: (id: number | string) =>
    `/signature-requests/${id}/cancel`,
  signatureRequestAuditTrail: (id: number | string) =>
    `/signature-requests/${id}/audit-trail`,
  businessSignatureRequests: (businessId: number | string) =>
    `/businesses/${businessId}/signature-requests`,
  signerView: (token: string) => `/sign/${token}`,
  signerApprove: (token: string) => `/sign/${token}/approve`,
  signerDecline: (token: string) => `/sign/${token}/decline`,

  // ── Users ─────────────────────────────────────────────────────────────────
  users: "/users",
  userById: (id: number | string) => `/users/${id}`,
  userActivate: (id: number | string) => `/users/${id}/activate`,
  userDeactivate: (id: number | string) => `/users/${id}/deactivate`,
  userResetPassword: (id: number | string) => `/users/${id}/reset-password`,
  userAuditLogs: "/users/audit-logs",

  // ── Reports ───────────────────────────────────────────────────────────────
  reportsAging: "/reports/aging",
  reportsAgingExport: "/reports/aging/export",
  reportsAnnualReportStatus: "/reports/annual-reports",
  reportsAdvancePayments: "/reports/advance-payments",
  reportsVatCompliance: "/reports/vat-compliance",

  // ── Reminders ─────────────────────────────────────────────────────────────
  reminders: "/reminders/",
  reminderById: (id: number) => `/reminders/${id}`,
  reminderCancel: (id: number) => `/reminders/${id}/cancel`,
  reminderMarkSent: (id: number) => `/reminders/${id}/mark-sent`,

  // ── Notifications ─────────────────────────────────────────────────────────
  notifications: "/notifications",
  notificationsUnreadCount: "/notifications/unread-count",
  notificationsMarkRead: "/notifications/mark-read",
  notificationsMarkAllRead: "/notifications/mark-all-read",
  notificationsSend: "/notifications/send",
} as const;

export const ACTION_ENDPOINT_PATTERNS: RegExp[] = [
  /^\/binders\/\d+\/ready$/,
  /^\/binders\/\d+\/revert-ready$/,
  /^\/binders\/\d+\/return$/,
  /^\/charges\/\d+\/issue$/,
  /^\/charges\/\d+\/mark-paid$/,
  /^\/charges\/\d+\/cancel$/,
  /^\/businesses\/\d+$/,
  /^\/tax-deadlines\/\d+\/complete$/,
  /^\/tax-deadlines\/\d+$/,
  /^\/annual-reports\/\d+\/amend$/,
  /^\/annual-reports\/\d+\/submit$/,
];
