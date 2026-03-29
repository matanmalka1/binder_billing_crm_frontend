export const TAX_DEADLINE_ENDPOINTS = {
  taxDeadlines: "/tax-deadlines",
  taxDeadlineById: (id: number | string) => `/tax-deadlines/${id}`,
  taxDeadlineComplete: (id: number | string) => `/tax-deadlines/${id}/complete`,
  taxDeadlinesDashboard: "/tax-deadlines/dashboard/urgent",
  taxDeadlinesTimeline: "/tax-deadlines/timeline",
  taxDeadlinesGenerate: "/tax-deadlines/generate",
} as const;
