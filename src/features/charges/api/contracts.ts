import type { PaginatedResponse } from "@/types";

export interface ChargeResponse {
  id: number;
  client_id: number;
  business_id?: number | null;
  business_name: string | null;
  annual_report_id: number | null;
  charge_type: string;
  status: string;
  amount: string;
  period: string | null;
  months_covered: number | null;
  description: string | null;
  created_at: string;
  created_by: number | null;
  issued_at: string | null;
  issued_by: number | null;
  paid_at: string | null;
  paid_by: number | null;
  canceled_at: string | null;
  canceled_by: number | null;
  cancellation_reason: string | null;
}

export type ChargeBase = ChargeResponse;
export type ChargeAdvisorResponse = ChargeResponse;
export type ChargeSecretaryResponse = ChargeResponse;

export type ChargesListResponse = PaginatedResponse<ChargeResponse>;

export interface ChargesListParams {
  client_id?: number;
  business_id?: number;
  status?: string;
  charge_type?: string;
  issued_before?: string;
  page?: number;
  page_size?: number;
}

export interface CreateChargePayload {
  client_id: number;
  business_id?: number | null;
  amount: string;
  charge_type:
    | "monthly_retainer"
    | "annual_report_fee"
    | "vat_filing_fee"
    | "representation_fee"
    | "consultation_fee"
    | "other";
  period?: string | null;
  months_covered?: number | null;
  description?: string | null;
  annual_report_id?: number | null;
}

export interface BulkChargeActionPayload {
  charge_ids: number[];
  action: "issue" | "mark-paid" | "cancel";
  cancellation_reason?: string;
}

export interface BulkChargeFailedItem {
  id: number;
  error: string;
}

export interface BulkChargeActionResult {
  succeeded: number[];
  failed: BulkChargeFailedItem[];
}
