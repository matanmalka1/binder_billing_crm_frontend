import type { BackendAction } from "@/lib/actions/types";
import type { PaginatedResponse } from "@/types";

export interface TaxDeadlineResponse {
  id: number;
  client_record_id: number;
  office_client_number?: number | null;
  client_name: string | null;
  deadline_type: string;
  period: string | null;
  due_date: string;
  status: string;
  payment_amount: string | null;
  description: string | null;
  completed_at: string | null;
  completed_by: number | null;
  advance_payment_id: number | null;
  created_at: string;
  available_actions?: BackendAction[];
}

export interface TimelineEntry {
  id: number;
  client_record_id: number;
  deadline_type: string;
  period: string | null;
  due_date: string;
  status: string;
  days_remaining: number;
  milestone_label: string;
  payment_amount: string | null;
}

export interface DeadlineUrgentItem {
  id: number;
  client_record_id: number;
  client_name: string;
  deadline_type: string;
  due_date: string;
  urgency: string;
  days_remaining: number;
  payment_amount: string | null;
}

export type TaxDeadlineListResponse = PaginatedResponse<TaxDeadlineResponse>;
