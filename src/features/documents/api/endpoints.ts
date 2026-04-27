export const DOCUMENT_ENDPOINTS = {
  documentsUpload: "/documents/upload",
  documentsByClient: (clientId: number | string) => `/documents/client/${clientId}`,
  documentSignalsByClient: (clientId: number | string) =>
    `/documents/client/${clientId}/signals`,
  documentVersionsByClient: (clientId: number | string) =>
    `/documents/client/${clientId}/versions`,
  documentsByAnnualReport: (reportId: number | string) => `/documents/annual-report/${reportId}`,
  documentById: (id: number | string) => `/documents/${id}`,
  documentReplace: (id: number | string) => `/documents/${id}/replace`,
  documentDownloadUrl: (id: number | string) => `/documents/${id}/download-url`,
} as const;
