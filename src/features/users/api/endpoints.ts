export const USER_ENDPOINTS = {
  users: "/users",
  userById: (id: number | string) => `/users/${id}`,
  userActivate: (id: number | string) => `/users/${id}/activate`,
  userDeactivate: (id: number | string) => `/users/${id}/deactivate`,
  userResetPassword: (id: number | string) => `/users/${id}/reset-password`,
  userAuditLogs: "/users/audit-logs",
} as const;
