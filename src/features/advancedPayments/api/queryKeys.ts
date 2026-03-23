export const advancedPaymentsQK = {
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
} as const;
