export const REMINDER_ENDPOINTS = {
  reminders: "/reminders/",
  reminderById: (id: number) => `/reminders/${id}`,
  reminderCancel: (id: number) => `/reminders/${id}/cancel`,
  reminderMarkSent: (id: number) => `/reminders/${id}/mark-sent`,
} as const;
