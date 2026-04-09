export const documentsQK = {
  clientList: (clientId: number) => ["documents", "client", clientId, "list"] as const,
  clientSignals: (clientId: number) => ["documents", "client", clientId, "signals"] as const,
  versions: (clientId: number, docType: string, taxYear?: number) =>
    ["documents", "client", clientId, "versions", { docType, taxYear }] as const,
  byAnnualReport: (reportId: number) => ["documents", "annual-report", reportId] as const,
} as const;
