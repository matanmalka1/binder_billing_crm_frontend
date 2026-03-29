export const CORRESPONDENCE_ENDPOINTS = {
  correspondenceList: (businessId: number | string) =>
    `/businesses/${businessId}/correspondence`,
  correspondenceById: (businessId: number | string, id: number | string) =>
    `/businesses/${businessId}/correspondence/${id}`,
} as const;
