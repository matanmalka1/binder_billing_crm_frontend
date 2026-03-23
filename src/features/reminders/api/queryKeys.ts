export const remindersQK = {
  all: ["reminders"] as const,
  list: (clientId?: number) => ["reminders", "list", clientId ?? "all"] as const,
} as const;
