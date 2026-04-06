export const taxDeadlinesQK = {
  all: ["tax", "deadlines"] as const,
  list: (params: object) => ["tax", "deadlines", "list", params] as const,
  timeline: (businessId: number) => ["tax-deadlines", "timeline", businessId] as const,
  forClient: (clientId: number) => ["tax_deadlines", "client", clientId] as const,
} as const;
