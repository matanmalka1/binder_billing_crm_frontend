export const vatReportsQK = {
  all: ["tax", "vat-work-items"] as const,
  lists: ["tax", "vat-work-items", "list"] as const,
  list: (params: object) => ["tax", "vat-work-items", "list", params] as const,
  lookup: (clientId: number, period: string) =>
    ["tax", "vat-work-items", "lookup", clientId, period] as const,
  periodOptions: (clientId: number, year?: number) =>
    ["tax", "vat-work-items", "period-options", clientId, year ?? null] as const,
  detail: (id: number) => ["tax", "vat-work-items", "detail", id] as const,
  forClient: (clientId: number) => ["tax", "vat-work-items", "client", clientId] as const,
  invoices: (id: number) => ["tax", "vat-work-items", "invoices", id] as const,
  audit: (id: number, params?: object) => ["tax", "vat-work-items", "audit", id, params ?? null] as const,
  clientSummary: (clientId: number) =>
    ["tax", "vat-work-items", "client-summary", clientId] as const,
} as const;
