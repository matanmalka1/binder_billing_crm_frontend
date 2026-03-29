export const CLIENT_ENDPOINTS = {
  clients: "/clients",
  clientById: (clientId: number | string) => `/clients/${clientId}`,
  clientRestore: (clientId: number | string) => `/clients/${clientId}/restore`,
  clientConflictByIdNumber: (idNumber: string) => `/clients/conflict/${idNumber}`,
  clientsExport: "/clients/export",
  clientsTemplate: "/clients/template",
  clientsImport: "/clients/import",
} as const;
