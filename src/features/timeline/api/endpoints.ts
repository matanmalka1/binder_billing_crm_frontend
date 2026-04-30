export const TIMELINE_ENDPOINTS = {
  clientTimeline: (clientId: number | string) => `/clients/${clientId}/timeline`,
} as const
