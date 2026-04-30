export const CORRESPONDENCE_ENDPOINTS = {
  correspondenceList: (clientId: number | string) => `/clients/${clientId}/correspondence`,
  correspondenceById: (clientId: number | string, id: number | string) =>
    `/clients/${clientId}/correspondence/${id}`,
} as const
