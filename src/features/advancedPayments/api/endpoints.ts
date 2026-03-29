export const ADVANCE_PAYMENT_ENDPOINTS = {
  businessAdvancePayments: (businessId: number | string) =>
    `/businesses/${businessId}/advance-payments`,
  businessAdvancePaymentById: (businessId: number | string, id: number | string) =>
    `/businesses/${businessId}/advance-payments/${id}`,
  businessAdvancePaymentSuggest: (businessId: number | string) =>
    `/businesses/${businessId}/advance-payments/suggest`,
  businessAdvancePaymentsKPI: (businessId: number | string) =>
    `/businesses/${businessId}/advance-payments/kpi`,
  businessAdvancePaymentsChart: (businessId: number | string) =>
    `/businesses/${businessId}/advance-payments/chart`,
  advancePaymentsOverview: "/advance-payments/overview",
  advancePaymentsGenerate: "/advance-payments/generate",
} as const;
