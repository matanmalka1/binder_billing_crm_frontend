import type { PaginatedResponse } from "@/types/common";

export type SignatureRequestStatus =
  | "draft"
  | "pending_signature"
  | "signed"
  | "declined"
  | "expired"
  | "canceled";

export type SignatureRequestType =
  | "engagement_agreement"
  | "annual_report_approval"
  | "power_of_attorney"
  | "vat_return_approval"
  | "custom";

export interface SignatureRequestResponse {
  id: number;
  client_id: number;
  created_by: number;
  request_type: SignatureRequestType;
  title: string;
  description: string | null;
  signer_name: string;
  signer_email: string | null;
  signer_phone: string | null;
  status: SignatureRequestStatus;
  created_at: string;
  sent_at: string | null;
  expires_at: string | null;
  signed_at: string | null;
  declined_at: string | null;
  canceled_at: string | null;
  decline_reason: string | null;
  annual_report_id: number | null;
  document_id: number | null;
}

export interface AuditEvent {
  id: number;
  event_type: string;
  actor_type: string;
  actor_name: string | null;
  ip_address: string | null;
  notes: string | null;
  occurred_at: string;
}

export interface SignatureRequestWithAudit extends SignatureRequestResponse {
  audit_trail: AuditEvent[];
}

export interface CreateSignatureRequestPayload {
  client_id: number;
  request_type: SignatureRequestType;
  title: string;
  description?: string;
  signer_name: string;
  signer_email?: string;
  signer_phone?: string;
}

export interface SendSignatureRequestPayload {
  expiry_days?: number;
}

export interface SendSignatureRequestResponse extends SignatureRequestResponse {
  signing_token: string;
  signing_url_hint: string;
}

export interface CancelSignatureRequestPayload {
  reason?: string;
}

export interface SignerViewResponse {
  request_id: number;
  title: string;
  description: string | null;
  signer_name: string;
  status: SignatureRequestStatus;
  request_type: string;
  content_hash: string | null;
  expires_at: string | null;
}

export interface SignerDeclinePayload {
  reason?: string;
}

export type SignatureRequestListResponse = PaginatedResponse<SignatureRequestResponse>;
