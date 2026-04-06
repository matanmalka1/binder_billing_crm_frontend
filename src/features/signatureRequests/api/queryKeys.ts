export const signatureRequestsQK = {
  all: ["signature-requests"] as const,
  signer: (token: string | undefined) => ["signer", token] as const,
  businessNamesBatch: (businessIds: number[]) =>
    ["business-names-batch", businessIds] as const,
  forBusiness: (businessId: number) => ["signature-requests", "business", businessId] as const,
  forBusinessPage: (businessId: number, params: object) =>
    ["signature-requests", "business", businessId, params] as const,
  forClient: (businessId: number) => ["signature-requests", "business", businessId] as const,
  forClientPage: (businessId: number, params: object) =>
    ["signature-requests", "business", businessId, params] as const,
  detail: (id: number) => ["signature-requests", "detail", id] as const,
  pending: (params: object) => ["signature-requests", "pending", params] as const,
} as const;
