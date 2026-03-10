import type { BackendAction } from "../../lib/actions/types";
import type { PaginatedResponse } from "../../types/common";

export interface BinderResponse {
  id: number;
  client_id: number;
  client_name: string | null;
  binder_number: string;
  binder_type: string;
  status: string;
  received_at: string;
  returned_at: string | null;
  pickup_person_name?: string | null;
  days_in_office?: number | null;
  work_state?: string | null;
  signals?: string[] | null;
  available_actions?: BackendAction[] | null;
}

export interface BinderListResponse {
  items: BinderResponse[];
  page: number;
  page_size: number;
  total: number;
}

export interface BinderExtended {
  id: number;
  client_id: number;
  binder_number: string;
  status: string;
  received_at: string;
  returned_at: string | null;
  pickup_person_name?: string | null;
  work_state?: string | null;
  signals?: string[] | null;
}

export type BinderExtendedListResponse = PaginatedResponse<BinderExtended>;

export interface BinderHistoryEntry {
  old_status: string;
  new_status: string;
  changed_by: number;
  changed_at: string;
  notes?: string | null;
}

export interface BinderHistoryResponse {
  binder_id: number;
  history: BinderHistoryEntry[];
}

export interface ListBindersParams {
  status?: string;
  client_id?: number;
  work_state?: string;
  query?: string;
  client_name?: string;
  binder_number?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_dir?: string;
  year?: number;
}

export interface ListOperationalBindersParams {
  page?: number;
  page_size?: number;
}

export interface ReceiveBinderPayload {
  client_id: number;
  binder_number: string;
  binder_type: string;
  received_at: string;
  received_by: number;
  notes?: string | null;
}

export interface ReturnBinderPayload {
  pickup_person_name?: string;
  returned_by?: number;
}

export type BindersFilters = Omit<ListBindersParams, "client_name" | "binder_number" | "year"> & {
  year?: string;
};

export interface BindersFiltersBarProps {
  filters: BindersFilters;
  onFilterChange: (name: string, value: string) => void;
}

// ── Shared variant maps (used by both table columns and drawer) ────────────

export const BINDER_WORK_STATE_VARIANTS: Record<string, "neutral" | "info" | "success"> = {
  waiting_for_work: "neutral",
  in_progress: "info",
  completed: "success",
};

export const BINDER_SIGNAL_VARIANTS: Record<string, "error" | "warning" | "info" | "neutral"> = {
  missing_permanent_documents: "warning",
  unpaid_charges: "warning",
  ready_for_pickup: "info",
  idle_binder: "neutral",
};

// ── Domain constants ───────────────────────────────────────────────────────

export const BINDER_TYPE_OPTIONS = [
  { value: "", label: "בחר סוג חומר...", disabled: true },
  { value: "vat", label: 'מע"מ' },
  { value: "income_tax", label: "מס הכנסה" },
  { value: "national_insurance", label: "ביטוח לאומי" },
  { value: "capital_declaration", label: "הצהרת הון" },
  { value: "annual_report", label: "דוח שנתי" },
  { value: "salary", label: "שכר" },
  { value: "bookkeeping", label: "הנהלת חשבונות" },
  { value: "other", label: "אחר" },
] as const;

export const BINDER_STATUS_OPTIONS = [
  { value: "", label: "כל הסטטוסים" },
  { value: "in_office", label: "במשרד" },
  { value: "ready_for_pickup", label: "מוכן לאיסוף" },
] as const;
