export const vatReportsQK = {
  all: ["tax", "vat-work-items"] as const,
  list: (params: object) => ["tax", "vat-work-items", "list", params] as const,
  lookup: (businessId: number, period: string) =>
    ["tax", "vat-work-items", "lookup", businessId, period] as const,
  detail: (id: number) => ["tax", "vat-work-items", "detail", id] as const,
  forClient: (clientId: number) => ["tax", "vat-work-items", "client", clientId] as const,
  invoices: (id: number) => ["tax", "vat-work-items", "invoices", id] as const,
  audit: (id: number) => ["tax", "vat-work-items", "audit", id] as const,
  clientSummary: (clientId: number) =>
    ["tax", "vat-work-items", "client-summary", clientId] as const,
} as const;
