export const annualReportsQK = {
  all: ["tax", "annual-reports"] as const,
  detail: (id: number) => ["tax", "annual-reports", "detail", id] as const,
  reportCharges: (reportId: number, page: number, pageSize: number) =>
    ["tax", "annual-reports", "charges", reportId, { page, page_size: pageSize }] as const,
  kanban: ["tax", "annual-reports", "kanban"] as const,
  statusHistory: (id: number | string) =>
    ["tax", "annual-reports", "status-history", id] as const,
  seasonSummary: (taxYear: number) =>
    ["tax", "annual-reports", "season", taxYear, "summary"] as const,
  seasonList: (taxYear: number) =>
    ["tax", "annual-reports", "season", taxYear, "list"] as const,
  overdue: (taxYear: number) =>
    ["tax", "annual-reports", "overdue", taxYear] as const,
  forClient: (clientId: number) =>
    ["tax", "annual-reports", "client", clientId] as const,
  financials: (id: number) =>
    ["tax", "annual-reports", "financials", id] as const,
  readiness: (id: number) =>
    ["tax", "annual-reports", "readiness", id] as const,
  details: (id: number) => ["tax", "annual-reports", id, "details"] as const,
  taxCalc: (id: number) => ["tax", "annual-reports", id, "tax-calc"] as const,
  advancesSummary: (id: number) =>
    ["tax", "annual-reports", id, "advances-summary"] as const,
  annex: (id: number, schedule: string) =>
    ["tax", "annual-reports", id, "annex", schedule] as const,
} as const;
