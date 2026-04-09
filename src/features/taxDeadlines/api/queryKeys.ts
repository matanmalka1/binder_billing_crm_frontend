export const taxDeadlinesQK = {
  all: ["tax", "deadlines"] as const,
  list: (params: object) => ["tax", "deadlines", "list", params] as const,
  timeline: (clientId: number) => ["tax-deadlines", "timeline", clientId] as const,
} as const;
