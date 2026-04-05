export const BINDER_ENDPOINTS = {
  binders: "/binders",
  binderById: (binderId: number | string) => `/binders/${binderId}`,
  binderReady: (binderId: number | string) => `/binders/${binderId}/ready`,
  binderRevertReady: (binderId: number | string) => `/binders/${binderId}/revert-ready`,
  binderReturn: (binderId: number | string) => `/binders/${binderId}/return`,
  binderReceive: "/binders/receive",
  binderHistory: (binderId: number | string) => `/binders/${binderId}/history`,
  binderIntakes: (binderId: number | string) => `/binders/${binderId}/intakes`,
  bindersOpen: "/binders/open",
  clientBinders: (clientId: number | string) => `/clients/${clientId}/binders`,
} as const;
