export const QK = {
  clients: {
    all: ["clients"] as const,
    list: (params: object) => ["clients", "list", params] as const,
    detail: (id: number) => ["clients", "detail", id] as const,
    taxProfile: (id: number) => ["clients", "tax-profile", id] as const,
  },
  binders: {
    all: ["binders"] as const,
    list: (params: object) => ["binders", "list", params] as const,
    forClient: (clientId: number) => ["binders", "client", clientId] as const,
    forClientPage: (
      clientId: number,
      page: number,
      pageSize: number,
    ) => ["binders", "client", clientId, { page, page_size: pageSize }] as const,
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
    clients: ["documents", "clients"] as const,
    clientList: (clientId: number) => ["documents", "client", clientId, "list"] as const,
    clientSignals: (clientId: number) => ["documents", "client", clientId, "signals"] as const,
  },
  tax: {
    deadlines: {
      all: ["tax", "deadlines"] as const,
      list: (params: object) => ["tax", "deadlines", "list", params] as const,
      urgent: ["tax", "deadlines", "urgent"] as const,
    },
    annualReports: {
      all: ["tax", "annual-reports"] as const,
      detail: (id: number) => ["tax", "annual-reports", "detail", id] as const,
      kanban: ["tax", "annual-reports", "kanban"] as const,
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
    },
    advancePayments: {
      all: ["tax", "advance-payments"] as const,
      forClientYear: (clientId: number, year: number) =>
        ["tax", "advance-payments", clientId, year] as const,
    },
  },
  reminders: {
    all: ["reminders"] as const,
    list: ["reminders", "list"] as const,
  },
  correspondence: {
    forClient: (clientId: number) => ["correspondence", "client", clientId] as const,
  },
  authorityContacts: {
    forClient: (clientId: number) => ["authority-contacts", "client", clientId] as const,
  },
  advisorToday: {
    all: ["advisor-today"] as const,
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
} as const;
