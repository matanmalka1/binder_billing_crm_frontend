export const SIGNATURE_REQUEST_ENDPOINTS = {
  signatureRequests: "/signature-requests",
  signatureRequestsPending: "/signature-requests/pending",
  signatureRequestById: (id: number | string) => `/signature-requests/${id}`,
  signatureRequestSend: (id: number | string) => `/signature-requests/${id}/send`,
  signatureRequestCancel: (id: number | string) => `/signature-requests/${id}/cancel`,
  signatureRequestAuditTrail: (id: number | string) => `/signature-requests/${id}/audit-trail`,
  clientSignatureRequests: (clientId: number | string) =>
    `/clients/${clientId}/signature-requests`,
  businessSignatureRequests: (businessId: number | string) =>
    `/businesses/${businessId}/signature-requests`,
  signerView: (token: string) => `/sign/${token}`,
  signerApprove: (token: string) => `/sign/${token}/approve`,
  signerDecline: (token: string) => `/sign/${token}/decline`,
} as const;
