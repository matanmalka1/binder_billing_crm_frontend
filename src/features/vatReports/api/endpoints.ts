export const VAT_ENDPOINTS = {
  vatWorkItemLookup: "/vat/work-items/lookup",
  vatWorkItems: "/vat/work-items",
  vatWorkItemById: (id: number | string) => `/vat/work-items/${id}`,
  vatWorkItemsByBusiness: (businessId: number | string) =>
    `/vat/businesses/${businessId}/work-items`,
  vatPeriodOptions: (businessId: number | string) => `/vat/businesses/${businessId}/period-options`,
  vatWorkItemMaterialsComplete: (id: number | string) =>
    `/vat/work-items/${id}/materials-complete`,
  vatWorkItemInvoices: (id: number | string) => `/vat/work-items/${id}/invoices`,
  vatWorkItemInvoiceById: (id: number | string, invoiceId: number | string) =>
    `/vat/work-items/${id}/invoices/${invoiceId}`,
  vatWorkItemReadyForReview: (id: number | string) => `/vat/work-items/${id}/ready-for-review`,
  vatWorkItemSendBack: (id: number | string) => `/vat/work-items/${id}/send-back`,
  vatWorkItemFile: (id: number | string) => `/vat/work-items/${id}/file`,
  vatWorkItemAudit: (id: number | string) => `/vat/work-items/${id}/audit`,
  vatBusinessSummary: (businessId: number | string) => `/vat/businesses/${businessId}/summary`,
  vatBusinessExport: (businessId: number | string) => `/vat/businesses/${businessId}/export`,
} as const;
