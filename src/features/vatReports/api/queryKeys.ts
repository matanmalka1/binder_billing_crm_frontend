export const vatReportsQK = {
  all: ["tax", "vat-work-items"] as const,
  list: (params: object) => ["tax", "vat-work-items", "list", params] as const,
  lookup: (businessId: number, period: string) =>
    ["tax", "vat-work-items", "lookup", businessId, period] as const,
  periodOptions: (businessId: number, year?: number) =>
    ["tax", "vat-work-items", "period-options", businessId, year ?? null] as const,
  detail: (id: number) => ["tax", "vat-work-items", "detail", id] as const,
  forBusiness: (businessId: number) => ["tax", "vat-work-items", "business", businessId] as const,
  forClient: (businessId: number) => ["tax", "vat-work-items", "business", businessId] as const,
  invoices: (id: number) => ["tax", "vat-work-items", "invoices", id] as const,
  audit: (id: number) => ["tax", "vat-work-items", "audit", id] as const,
  businessSummary: (businessId: number) =>
    ["tax", "vat-work-items", "business-summary", businessId] as const,
  clientSummary: (clientId: number) =>
    ["tax", "vat-work-items", "business-summary", clientId] as const,
} as const;
