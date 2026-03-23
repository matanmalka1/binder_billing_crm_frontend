export const usersQK = {
  all: ["users"] as const,
  list: (params: object) => ["users", "list", params] as const,
  auditLogs: (params: object) => ["users", "audit-logs", params] as const,
} as const;
