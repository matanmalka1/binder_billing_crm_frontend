export const bindersQK = {
  all: ["binders"] as const,
  list: (params: object) => ["binders", "list", params] as const,
  detail: (binderId: number) => ["binders", "detail", binderId] as const,
  detailFallback: () => ["binders", "detail", "none"] as const,
  open: (page: number, pageSize: number) =>
    ["binders", "open", { page, page_size: pageSize }] as const,
  forClient: (clientId: number) => ["binders", "client", clientId] as const,
  forClientPage: (clientId: number, page: number, pageSize: number) =>
    ["binders", "client", clientId, { page, page_size: pageSize }] as const,
  history: (binderId: number) => ["binders", "history", binderId] as const,
  intakes: (binderId: number) => ["binders", "intakes", binderId] as const,
} as const;
