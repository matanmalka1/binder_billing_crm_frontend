export const QK = {
  clients: {
    all: ["clients"] as const,
    list: (params: object) => ["clients", "list", params] as const,
    detail: (id: number) => ["clients", "detail", id] as const,
    taxProfile: (id: number) => ["clients", "tax-profile", id] as const,
  },
  binders: {
    all: ["binders"] as const,
    list: (params: object) => ["binders", "list", params] as const,
    forClient: (clientId: number) => ["binders", "client", clientId] as const,
  },
  charges: {
    all: ["charges"] as const,
    list: (params: object) => ["charges", "list", params] as const,
    detail: (id: number) => ["charges", "detail", id] as const,
  },
  tax: {
    deadlines: {
      all: ["tax", "deadlines"] as const,
      list: (params: object) => ["tax", "deadlines", "list", params] as const,
      urgent: ["tax", "deadlines", "urgent"] as const,
    },
    annualReports: {
      all: ["tax", "annual-reports"] as const,
      detail: (id: number) => ["tax", "annual-reports", "detail", id] as const,
      kanban: ["tax", "annual-reports", "kanban"] as const,
    },
    advancePayments: {
      all: ["tax", "advance-payments"] as const,
      forClientYear: (clientId: number, year: number) =>
        ["tax", "advance-payments", clientId, year] as const,
    },
  },
  reminders: {
    all: ["reminders"] as const,
    list: ["reminders", "list"] as const,
  },
  advisorToday: {
    all: ["advisor-today"] as const,
    deadlines: ["advisor-today", "deadlines"] as const,
    reports: ["advisor-today", "reports"] as const,
    reminders: ["advisor-today", "reminders"] as const,
    charges: ["advisor-today", "charges"] as const,
  },
} as const;
