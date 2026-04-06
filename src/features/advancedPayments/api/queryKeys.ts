export const advancedPaymentsQK = {
  all: ["tax", "advance-payments"] as const,
  forBusinessYear: (businessId: number, year: number) =>
    ["tax", "advance-payments", businessId, year] as const,
  list: (businessId: number, year: number, page: number, statusFilter?: string[]) =>
    ["tax", "advance-payments", businessId, year, { page, status: statusFilter ?? [] }] as const,
  forClientYear: (businessId: number, year: number) =>
    ["tax", "advance-payments", businessId, year] as const,
  suggestion: (businessId: number, year: number, periodMonthsCount: 1 | 2) =>
    ["tax", "advance-payments", businessId, year, periodMonthsCount, "suggest"] as const,
  overview: (params: object) =>
    ["tax", "advance-payments", "overview", params] as const,
  kpi: (businessId: number, year: number) =>
    ["tax", "advance-payments", businessId, year, "kpi"] as const,
  chart: (businessId: number, year: number) =>
    ["tax", "advance-payments", businessId, year, "chart"] as const,
} as const;
