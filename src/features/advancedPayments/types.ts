export type AdvancePaymentStatus = "pending" | "paid" | "partial" | "overdue";

export interface AdvancePaymentRow {
  id: number;
  business_id: number;
  period: string;
  period_months_count: 1 | 2;
  expected_amount: number | null;
  paid_amount: number | null;
  status: AdvancePaymentStatus;
  due_date: string;
  paid_at: string | null;
  payment_method: string | null;
  annual_report_id: number | null;
  notes: string | null;
  delta: number | null;
  created_at: string;
  updated_at: string | null;
}

export interface ListAdvancePaymentsParams {
  business_id: number;
  year: number;
  status?: AdvancePaymentStatus[];
  page?: number;
  page_size?: number;
}

export interface CreateAdvancePaymentPayload {
  business_id: number;
  period: string;
  period_months_count: 1 | 2;
  due_date: string;
  expected_amount?: number | null;
  paid_amount?: number | null;
  payment_method?: string | null;
  notes?: string | null;
}

export interface UpdateAdvancePaymentPayload {
  paid_amount?: number | null;
  expected_amount?: number | null;
  status?: AdvancePaymentStatus;
  paid_at?: string | null;
  payment_method?: string | null;
  notes?: string | null;
}

export interface AdvancePaymentOverviewRow {
  id: number;
  business_id: number;
  business_name: string;
  period: string;
  expected_amount: number | null;
  paid_amount: number | null;
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
  total_expected: number | null;
  total_paid: number | null;
  collection_rate: number | null;
}

export interface AdvancePaymentSuggestionResponse {
  business_id: number;
  year: number;
  suggested_amount: number | null;
  has_data: boolean;
}

export interface AnnualKPIResponse {
  business_id: number;
  year: number;
  total_expected: number;
  total_paid: number;
  collection_rate: number;
  overdue_count: number;
  on_time_count: number;
}

export interface MonthlyChartRow {
  period: string;
  expected_amount: number;
  paid_amount: number;
  overdue_amount: number;
}

export interface ChartDataResponse {
  business_id: number;
  year: number;
  months: MonthlyChartRow[];
}
