export const CLIENT_ENDPOINTS = {
  clients: "/clients",
  clientsOnboarding: "/clients/onboarding",
  clientById: (clientId: number | string) => `/clients/${clientId}`,
  clientRestore: (clientId: number | string) => `/clients/${clientId}/restore`,
  clientStatusCard: (clientId: number | string) => `/clients/${clientId}/status-card`,
  clientConflictByIdNumber: (idNumber: string) => `/clients/conflict/${idNumber}`,
  clientAuditTrail: (clientId: number | string) => `/audit/client/${clientId}`,
  clientsExport: "/clients/export",
  clientsTemplate: "/clients/template",
  clientsImport: "/clients/import",
} as const;

export const CLIENT_ROUTES = {
  list: "/clients",
  detail: (clientId: number | string) => `/clients/${clientId}`,
  timeline: (clientId: number | string) => `/clients/${clientId}/timeline`,
  vat: (clientId: number | string) => `/clients/${clientId}/vat`,
  advancePayments: (clientId: number | string) => `/clients/${clientId}/advance-payments`,
  annualReports: (clientId: number | string) => `/clients/${clientId}/annual-reports`,
  documents: (clientId: number | string) => `/clients/${clientId}/documents`,
  businessDetail: (clientId: number | string, businessId: number | string) =>
    `/clients/${clientId}/businesses/${businessId}`,
} as const;
