export const DOCUMENT_ENDPOINTS = {
  documentsUpload: "/documents/upload",
  documentsByBusiness: (businessId: number | string) => `/documents/business/${businessId}`,
  documentSignalsByBusiness: (businessId: number | string) =>
    `/documents/business/${businessId}/signals`,
  documentVersionsByBusiness: (businessId: number | string) =>
    `/documents/business/${businessId}/versions`,
  documentsByAnnualReport: (reportId: number | string) => `/documents/annual-report/${reportId}`,
  documentById: (id: number | string) => `/documents/${id}`,
  documentReplace: (id: number | string) => `/documents/${id}/replace`,
  documentDownloadUrl: (id: number | string) => `/documents/${id}/download-url`,
  documentApprove: (id: number | string) => `/documents/${id}/approve`,
  documentReject: (id: number | string) => `/documents/${id}/reject`,
  documentNotes: (id: number | string) => `/documents/${id}/notes`,
} as const;
