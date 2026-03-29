export const documentsQK = {
  businessList: (businessId: number) => ["documents", "business", businessId, "list"] as const,
  businessSignals: (businessId: number) => ["documents", "business", businessId, "signals"] as const,
  clientList: (businessId: number) => ["documents", "business", businessId, "list"] as const,
  clientSignals: (businessId: number) => ["documents", "business", businessId, "signals"] as const,
  versions: (businessId: number, docType: string, taxYear?: number) =>
    ["documents", "business", businessId, "versions", { docType, taxYear }] as const,
  byAnnualReport: (reportId: number) => ["documents", "annual-report", reportId] as const,
} as const;
