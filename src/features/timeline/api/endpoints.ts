export const TIMELINE_ENDPOINTS = {
  businessTimeline: (businessId: number | string) => `/businesses/${businessId}/timeline`,
} as const;
