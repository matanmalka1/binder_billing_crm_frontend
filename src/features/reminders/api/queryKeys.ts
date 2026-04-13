export const remindersQK = {
  all: ["reminders"] as const,
  list: (clientId?: number, status?: string) =>
    ["reminders", "list", clientId ?? "all", status ?? "pending"] as const,
} as const;
