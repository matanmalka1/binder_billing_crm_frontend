/**
 * GLOBAL QUERY KEY REGISTRY
 * Source of truth for all cache keys.
 * Feature-local queryKeys files under `features/.../api/queryKeys.ts` are mirrors used within feature boundaries.
 * Cross-domain invalidation must use this file.
 * Do not add new keys here without also adding them to the relevant feature queryKeys.ts.
 */
export const QK = {
  clients: {
    all: ["clients"] as const,
    list: (params: object) => ["clients", "list", params] as const,
    detail: (id: number) => ["clients", "detail", id] as const,
    taxProfile: (id: number) => ["businesses", "tax-profile", id] as const,
    statusCard: (id: number, year?: number) =>
      ["businesses", "status-card", id, year ?? "current"] as const,
  },
  businesses: {
    all: ["businesses"] as const,
    list: (params: object) => ["businesses", "list", params] as const,
    detail: (id: number) => ["businesses", "detail", id] as const,
    taxProfile: (id: number) => ["businesses", "tax-profile", id] as const,
    statusCard: (id: number, year?: number) =>
      ["businesses", "status-card", id, year ?? "current"] as const,
  },
  binders: {
    all: ["binders"] as const,
    list: (params: object) => ["binders", "list", params] as const,
    detail: (binderId: number) => ["binders", "detail", binderId] as const,
    open: (page: number, pageSize: number) =>
      ["binders", "open", { page, page_size: pageSize }] as const,
    forClient: (clientId: number) => ["binders", "client", clientId] as const,
    forClientPage: (
      clientId: number,
      page: number,
      pageSize: number,
    ) => ["binders", "client", clientId, { page, page_size: pageSize }] as const,
    history: (binderId: number) => ["binders", "history", binderId] as const,
    intakes: (binderId: number) => ["binders", "intakes", binderId] as const,
  },
  charges: {
    all: ["charges"] as const,
    list: (params: object) => ["charges", "list", params] as const,
    detail: (id: number) => ["charges", "detail", id] as const,
    forBusinessPage: (
      businessId: number,
      page: number,
      pageSize: number,
    ) => ["charges", "business", businessId, { page, page_size: pageSize }] as const,
    forClientPage: (
      businessId: number,
      page: number,
      pageSize: number,
    ) => ["charges", "business", businessId, { page, page_size: pageSize }] as const,
  },
  timeline: {
    businessRoot: (businessId: number) => ["timeline", "business", businessId] as const,
    businessEvents: (businessId: number, params: object) =>
      ["timeline", "business", businessId, "events", params] as const,
    clientRoot: (businessId: number) => ["timeline", "business", businessId] as const,
    clientEvents: (businessId: number, params: object) =>
      ["timeline", "business", businessId, "events", params] as const,
  },
  documents: {
    businessList: (businessId: number) => ["documents", "business", businessId, "list"] as const,
    businessSignals: (businessId: number) => ["documents", "business", businessId, "signals"] as const,
    versions: (businessId: number, docType: string, taxYear?: number) =>
      ["documents", "business", businessId, "versions", { docType, taxYear }] as const,
    clientList: (businessId: number) => ["documents", "business", businessId, "list"] as const,
    clientSignals: (businessId: number) => ["documents", "business", businessId, "signals"] as const,
    byAnnualReport: (reportId: number) =>
      ["documents", "annual-report", reportId] as const,
  },
  tax: {
    deadlines: {
      all: ["tax", "deadlines"] as const,
      list: (params: object) => ["tax", "deadlines", "list", params] as const,
    },
    annualReports: {
      all: ["tax", "annual-reports"] as const,
      detail: (id: number) => ["tax", "annual-reports", "detail", id] as const,
      kanban: ["tax", "annual-reports", "kanban"] as const,
      statusHistory: (id: number | string) => ["tax", "annual-reports", "status-history", id] as const,
      seasonSummary: (taxYear: number) =>
        ["tax", "annual-reports", "season", taxYear, "summary"] as const,
      seasonList: (taxYear: number) =>
        ["tax", "annual-reports", "season", taxYear, "list"] as const,
      overdue: (taxYear: number) => ["tax", "annual-reports", "overdue", taxYear] as const,
    },
    vatWorkItems: {
      all: ["tax", "vat-work-items"] as const,
      list: (params: object) => ["tax", "vat-work-items", "list", params] as const,
      detail: (id: number) => ["tax", "vat-work-items", "detail", id] as const,
      forBusiness: (businessId: number) => ["tax", "vat-work-items", "business", businessId] as const,
      forClient: (businessId: number) => ["tax", "vat-work-items", "business", businessId] as const,
      invoices: (id: number) => ["tax", "vat-work-items", "invoices", id] as const,
      audit: (id: number) => ["tax", "vat-work-items", "audit", id] as const,
      businessSummary: (businessId: number) =>
        ["tax", "vat-work-items", "business-summary", businessId] as const,
      clientSummary: (businessId: number) =>
        ["tax", "vat-work-items", "business-summary", businessId] as const,
    },
    annualReportsForBusiness: (businessId: number) =>
      ["tax", "annual-reports", "business", businessId] as const,
    annualReportsForClient: (businessId: number) =>
      ["tax", "annual-reports", "business", businessId] as const,
    annualReportFinancials: (id: number) =>
      ["tax", "annual-reports", "financials", id] as const,
    annualReportReadiness: (id: number) =>
      ["tax", "annual-reports", "readiness", id] as const,
    annualReportDetails: (id: number) =>
      ["tax", "annual-reports", id, "details"] as const,
    annualReportTaxCalc: (id: number) =>
      ["tax", "annual-reports", id, "tax-calc"] as const,
    annualReportAdvancesSummary: (id: number) =>
      ["tax", "annual-reports", id, "advances-summary"] as const,
    annualReportAnnex: (id: number, schedule: string) =>
      ["tax", "annual-reports", id, "annex", schedule] as const,
    advancePayments: {
      all: ["tax", "advance-payments"] as const,
      forBusinessYear: (businessId: number, year: number) =>
        ["tax", "advance-payments", businessId, year] as const,
      forClientYear: (businessId: number, year: number) =>
        ["tax", "advance-payments", businessId, year] as const,
      suggestion: (businessId: number, year: number) =>
        ["tax", "advance-payments", businessId, year, "suggest"] as const,
      overview: (params: object) =>
        ["tax", "advance-payments", "overview", params] as const,
      kpi: (businessId: number, year: number) =>
        ["tax", "advance-payments", businessId, year, "kpi"] as const,
      chart: (businessId: number, year: number) =>
        ["tax", "advance-payments", businessId, year, "chart"] as const,
    },
  },
  reminders: {
    all: ["reminders"] as const,
    list: (businessId?: number) => ["reminders", "list", businessId ?? "all"] as const,
  },
  correspondence: {
    forBusiness: (businessId: number) => ["correspondence", "business", businessId] as const,
    forClient: (businessId: number) => ["correspondence", "business", businessId] as const,
  },
  authorityContacts: {
    forBusiness: (businessId: number) => ["authority-contacts", "business", businessId] as const,
    forClient: (businessId: number) => ["authority-contacts", "business", businessId] as const,
    detail: (contactId: number) => ["authority-contacts", "detail", contactId] as const,
  },
  advisorToday: {
    deadlines: ["advisor-today", "deadlines"] as const,
    reports: ["advisor-today", "reports"] as const,
    reminders: ["advisor-today", "reminders"] as const,
    charges: ["advisor-today", "charges"] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
    overview: ["dashboard", "overview"] as const,
    summary: ["dashboard", "summary"] as const,
  },
  taxDashboard: {
    submissions: (year: number) => ["tax", "submissions", year] as const,
    urgentDeadlines: ["tax", "deadlines", "urgent"] as const,
  },
  search: {
    results: (filters: object) => ["search", "results", filters] as const,
  },
  users: {
    all: ["users"] as const,
    list: (params: object) => ["users", "list", params] as const,
    auditLogs: (params: object) => ["users", "audit-logs", params] as const,
  },
  reports: {
    aging: (asOfDate: string) => ["reports", "aging", asOfDate] as const,
    annualReportStatus: (taxYear: number) =>
      ["reports", "annual-report-status", taxYear] as const,
    advancePayments: (year: number, month?: number) =>
      ["reports", "advance-payments", year, month ?? null] as const,
    vatCompliance: (year: number) => ["reports", "vat-compliance", year] as const,
  },
  signatureRequests: {
    all: ["signature-requests"] as const,
    forBusiness: (businessId: number) =>
      ["signature-requests", "business", businessId] as const,
    forBusinessPage: (businessId: number, params: object) =>
      ["signature-requests", "business", businessId, params] as const,
    forClient: (businessId: number) =>
      ["signature-requests", "business", businessId] as const,
    forClientPage: (businessId: number, params: object) =>
      ["signature-requests", "business", businessId, params] as const,
    detail: (id: number) => ["signature-requests", "detail", id] as const,
    pending: (params: object) =>
      ["signature-requests", "pending", params] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: (params?: object) => ["notifications", "list", params ?? {}] as const,
    unreadCount: (businessId?: number) =>
      ["notifications", "unread-count", businessId ?? "global"] as const,
  },
  taxDeadlines: {
    timeline: (businessId: number) => ["tax-deadlines", "timeline", businessId] as const,
  },
} as const;
