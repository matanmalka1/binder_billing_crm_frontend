export const remindersQK = {
  all: ["reminders"] as const,
  list: (clientId?: number, status?: string, page?: number, pageSize?: number) =>
    ["reminders", "list", clientId ?? "all", status ?? "pending", { page, page_size: pageSize }] as const,
  count: (clientId?: number, status?: string) =>
    ["reminders", "count", clientId ?? "all", status ?? "pending"] as const,
} as const;
