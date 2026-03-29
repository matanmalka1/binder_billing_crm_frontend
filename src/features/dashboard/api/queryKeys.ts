export const dashboardQK = {
  all: ["dashboard"] as const,
  overview: ["dashboard", "overview"] as const,
  summary: ["dashboard", "summary"] as const,
  advisorToday: {
    deadlines: ["advisor-today", "deadlines"] as const,
    reports: ["advisor-today", "reports"] as const,
    reminders: ["advisor-today", "reminders"] as const,
    charges: ["advisor-today", "charges"] as const,
  },
} as const;
