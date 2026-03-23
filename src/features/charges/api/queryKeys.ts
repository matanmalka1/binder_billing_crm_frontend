export const chargesQK = {
  all: ["charges"] as const,
  list: (params: object) => ["charges", "list", params] as const,
  detail: (id: number) => ["charges", "detail", id] as const,
  forClientPage: (clientId: number, page: number, pageSize: number) =>
    ["charges", "client", clientId, { page, page_size: pageSize }] as const,
} as const;
