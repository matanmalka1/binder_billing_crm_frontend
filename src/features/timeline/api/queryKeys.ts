export const timelineQK = {
  businessRoot: (businessId: number) => ["timeline", "business", businessId] as const,
  businessEvents: (businessId: number, params: object) =>
    ["timeline", "business", businessId, "events", params] as const,
  clientRoot: (businessId: number) => ["timeline", "business", businessId] as const,
  clientEvents: (businessId: number, params: object) =>
    ["timeline", "business", businessId, "events", params] as const,
} as const;
