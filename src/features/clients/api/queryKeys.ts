export const clientsQK = {
  all: ["clients"] as const,
  list: (params: object) => ["clients", "list", params] as const,
  detail: (id: number) => ["clients", "detail", id] as const,
  taxProfile: (id: number) => ["clients", "tax-profile", id] as const,
  statusCard: (id: number, year?: number) =>
    ["clients", "status-card", id, year ?? "current"] as const,
  businesses: (clientId: number) => ["clients", "businesses", clientId] as const,
  businessesAll: (clientId: number) => ["clients", "businesses", "all", clientId] as const,
  firstBusiness: (clientId: number) => ["clients", "businesses", "first", clientId] as const,
} as const;
