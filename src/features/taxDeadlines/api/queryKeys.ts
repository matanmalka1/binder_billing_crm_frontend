export const taxDeadlinesQK = {
  all: ["tax", "deadlines"] as const,
  list: (params: object) => ["tax", "deadlines", "list", params] as const,
  timeline: (businessId: number) => ["tax-deadlines", "timeline", businessId] as const,
} as const;
