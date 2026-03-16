export const QK = {
  clients: {
    all: ["clients"] as const,
    list: (params: object) => ["clients", "list", params] as const,
    detail: (id: number) => ["clients", "detail", id] as const,
    taxProfile: (id: number) => ["clients", "tax-profile", id] as const,
    statusCard: (id: number) => ["clients", "status-card", id] as const,
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
    forClientPage: (
      clientId: number,
      page: number,
      pageSize: number,
    ) => ["charges", "client", clientId, { page, page_size: pageSize }] as const,
  },
  timeline: {
    clientRoot: (clientId: number) => ["timeline", "client", clientId] as const,
    clientEvents: (clientId: number, params: object) =>
      ["timeline", "client", clientId, "events", params] as const,
  },
  documents: {
    clientList: (clientId: number) => ["documents", "client", clientId, "list"] as const,
    clientSignals: (clientId: number) => ["documents", "client", clientId, "signals"] as const,
    versions: (clientId: number, docType: string, taxYear?: number) =>
      ["documents", "client", clientId, "versions", { docType, taxYear }] as const,
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
      forClient: (clientId: number) => ["tax", "vat-work-items", "client", clientId] as const,
      invoices: (id: number) => ["tax", "vat-work-items", "invoices", id] as const,
      audit: (id: number) => ["tax", "vat-work-items", "audit", id] as const,
      clientSummary: (clientId: number) =>
        ["tax", "vat-work-items", "client-summary", clientId] as const,
    },
    annualReportsForClient: (clientId: number) =>
      ["tax", "annual-reports", "client", clientId] as const,
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
      forClientYear: (clientId: number, year: number) =>
        ["tax", "advance-payments", clientId, year] as const,
      suggestion: (clientId: number, year: number) =>
        ["tax", "advance-payments", clientId, year, "suggest"] as const,
      overview: (params: object) =>
        ["tax", "advance-payments", "overview", params] as const,
      kpi: (clientId: number, year: number) =>
        ["tax", "advance-payments", clientId, year, "kpi"] as const,
      chart: (clientId: number, year: number) =>
        ["tax", "advance-payments", clientId, year, "chart"] as const,
    },
  },
  reminders: {
    all: ["reminders"] as const,
    list: (clientId?: number) => ["reminders", "list", clientId ?? "all"] as const,
  },
  correspondence: {
    forClient: (clientId: number) => ["correspondence", "client", clientId] as const,
  },
  authorityContacts: {
    forClient: (clientId: number) => ["authority-contacts", "client", clientId] as const,
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
    forClient: (clientId: number) =>
      ["signature-requests", "client", clientId] as const,
    forClientPage: (clientId: number, params: object) =>
      ["signature-requests", "client", clientId, params] as const,
    detail: (id: number) => ["signature-requests", "detail", id] as const,
    pending: (params: object) =>
      ["signature-requests", "pending", params] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: (params?: object) => ["notifications", "list", params ?? {}] as const,
    unreadCount: (clientId?: number) =>
      ["notifications", "unread-count", clientId ?? "global"] as const,
  },
  taxDeadlines: {
    timeline: (clientId: number) => ["tax-deadlines", "timeline", clientId] as const,
  },
} as const;
