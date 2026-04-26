export type AdvancePaymentStatus = "pending" | "paid" | "partial" | "overdue";
export type AdvancePaymentMethod =
  | "bank_transfer"
  | "credit_card"
  | "check"
  | "direct_debit"
  | "cash"
  | "other";

export interface AdvancePaymentRow {
  id: number;
  client_record_id: number;
  business_name?: string | null;
  period: string;
  period_months_count: 1 | 2;
  expected_amount: string | null;
  paid_amount: string | null;
  status: AdvancePaymentStatus;
  due_date: string;
  paid_at: string | null;
  payment_method: AdvancePaymentMethod | null;
  annual_report_id: number | null;
  notes: string | null;
  delta: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface ListAdvancePaymentsParams {
  client_id: number;
  year: number;
  status?: AdvancePaymentStatus[];
  page?: number;
  page_size?: number;
}

export interface CreateAdvancePaymentPayload {
  period: string;
  period_months_count: 1 | 2;
  due_date: string;
  expected_amount?: string | null;
  paid_amount?: string | null;
  payment_method?: AdvancePaymentMethod | null;
  annual_report_id?: number | null;
  notes?: string | null;
}

export interface UpdateAdvancePaymentPayload {
  paid_amount?: string | null;
  expected_amount?: string | null;
  status?: AdvancePaymentStatus;
  paid_at?: string | null;
  payment_method?: AdvancePaymentMethod | null;
  notes?: string | null;
}

export interface AdvancePaymentOverviewRow {
  id: number;
  client_record_id: number;
  office_client_number?: number | null;
  business_name: string;
  period: string;
  period_months_count: 1 | 2;
  expected_amount: string | null;
  paid_amount: string | null;
  delta: string | null;
  status: AdvancePaymentStatus;
  due_date: string;
}

export interface ListAdvancePaymentsOverviewParams {
  year: number;
  month?: number;
  status?: AdvancePaymentStatus[];
  page?: number;
  page_size?: number;
}

export interface AdvancePaymentOverviewResponse {
  items: AdvancePaymentOverviewRow[];
  page: number;
  page_size: number;
  total: number;
  total_expected: string | null;
  total_paid: string | null;
  collection_rate: number | null;
}

export interface AdvancePaymentSuggestionResponse {
  client_record_id: number;
  year: number;
  suggested_amount: string | null;
  has_data: boolean;
}

export interface AnnualKPIResponse {
  client_record_id: number;
  year: number;
  total_expected: string;
  total_paid: string;
  collection_rate: number;
  overdue_count: number;
  on_time_count: number;
}
