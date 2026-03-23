export const taxDeadlinesQK = {
  timeline: (clientId: number) => ["tax-deadlines", "timeline", clientId] as const,
} as const;
