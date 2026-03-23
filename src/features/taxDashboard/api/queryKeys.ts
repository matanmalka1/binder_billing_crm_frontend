export const taxDashboardQK = {
  submissions: (year: number) => ["tax", "submissions", year] as const,
  urgentDeadlines: ["tax", "deadlines", "urgent"] as const,
} as const;
