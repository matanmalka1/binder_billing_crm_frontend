import type { PaginatedResponse } from "@/types/common";

export interface ChargeBase {
  id: number;
  client_id: number;
  client_name: string | null;
  charge_type: string;
  period: string | null;
  status: string;
  created_at: string;
  issued_at: string | null;
  paid_at: string | null;
}

export interface ChargeAdvisorResponse extends ChargeBase {
  amount: number;
  currency: string;
}

export interface ChargeSecretaryResponse extends ChargeBase {
  amount?: never;
  currency?: never;
}

export type ChargeResponse = ChargeAdvisorResponse | ChargeSecretaryResponse;
export type ChargesListResponse = PaginatedResponse<ChargeResponse>;

export interface ChargesListParams {
  client_id?: number;
  status?: string;
  charge_type?: string;
  issued_before?: string;
  page?: number;
  page_size?: number;
}

export interface CreateChargePayload {
  client_id: number;
  amount: number;
  charge_type: "retainer" | "one_time";
  period?: string | null;
  currency?: string;
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
