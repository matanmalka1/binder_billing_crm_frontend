export const businessesQK = {
  all: ["businesses"] as const,
  detail: (id: number | null) => ["businesses", "detail", id ?? "none"] as const,
} as const;
