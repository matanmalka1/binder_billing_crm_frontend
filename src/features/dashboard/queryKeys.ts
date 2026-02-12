export const dashboardKeys = {
  all: ["dashboard"] as const,
  overview: () => [...dashboardKeys.all, "overview"] as const,
  summary: () => [...dashboardKeys.all, "summary"] as const,
  attention: () => [...dashboardKeys.all, "attention"] as const,
};
