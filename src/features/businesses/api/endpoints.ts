export const BUSINESS_ENDPOINTS = {
  businesses: "/businesses",
  businessById: (businessId: number | string) => `/businesses/${businessId}`,
  businessRestore: (businessId: number | string) => `/businesses/${businessId}/restore`,
  businessStatusCard: (businessId: number | string) => `/businesses/${businessId}/status-card`,
  businessTaxProfile: (businessId: number | string) => `/businesses/${businessId}/tax-profile`,
} as const;
