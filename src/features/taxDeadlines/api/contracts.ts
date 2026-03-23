import type { PaginatedResponse } from "@/types/common";

export interface TaxDeadlineResponse {
  id: number;
  client_id: number;
  client_name: string | null;
  deadline_type: string;
  due_date: string;
  status: string;
  payment_amount: number | null;
  currency: string;
  description: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface TimelineEntry {
  id: number;
  due_date: string;
  deadline_type: string;
  status: string;
  days_remaining: number;
  milestone_label: string;
}

export interface DeadlineUrgentItem {
  id: number;
  client_id: number;
  client_name: string;
  deadline_type: string;
  due_date: string;
  urgency: string;
  days_remaining: number;
  payment_amount: number | null;
}

export type TaxDeadlineListResponse = PaginatedResponse<TaxDeadlineResponse>;
