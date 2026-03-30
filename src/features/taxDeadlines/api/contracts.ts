import type { BackendAction } from "@/lib/actions/types";
import type { PaginatedResponse } from "@/types";

export interface TaxDeadlineResponse {
  id: number;
  business_id: number;
  client_id?: number;
  business_name: string | null;
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
  business_id: number;
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
  business_id: number;
  business_name: string;
  deadline_type: string;
  due_date: string;
  urgency: string;
  days_remaining: number;
  payment_amount: string | null;
}

export type TaxDeadlineListResponse = PaginatedResponse<TaxDeadlineResponse>;
