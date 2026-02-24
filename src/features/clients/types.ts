import type { ListClientsParams } from "../../api/clients.api";

export interface ClientsFilters extends Omit<ListClientsParams, "has_signals"> {
  has_signals: string;
  search: string;
}

export interface ClientsFiltersBarProps {
  filters: ClientsFilters;
  onFilterChange: (name: "has_signals" | "status" | "page_size" | "search", value: string) => void;
}

export interface ClientBinderSummary {
  id: number;
  binder_number: string;
  received_at: string;
}

export interface ClientChargeSummary {
  id: number;
  charge_type: string;
  status: string;
}