export const TAX_DEADLINE_ENDPOINTS = {
  taxDeadlines: '/tax-deadlines',
  taxDeadlineById: (id: number | string) => `/tax-deadlines/${id}`,
  taxDeadlineComplete: (id: number | string) => `/tax-deadlines/${id}/complete`,
  taxDeadlineReopen: (id: number | string) => `/tax-deadlines/${id}/reopen`,
  taxDeadlinesDashboard: '/tax-deadlines/dashboard/urgent',
  taxDeadlinesTimeline: '/tax-deadlines/timeline',
  taxDeadlinesGenerate: '/tax-deadlines/generate',
  taxDeadlinesGrouped: '/tax-deadlines/grouped',
  taxDeadlinesGroupClients: (groupKey: string) =>
    `/tax-deadlines/grouped/${encodeURIComponent(groupKey)}/clients`,
} as const
