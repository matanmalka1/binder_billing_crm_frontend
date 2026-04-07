import type { ClientStatus, ListClientsParams } from "./api";

export interface ClientsFilters extends ListClientsParams {
  search: string;
  status?: ClientStatus;
  sort_by: "full_name" | "created_at" | "status";
  sort_order: "asc" | "desc";
}

export interface ClientsFiltersBarProps {
  filters: ClientsFilters;
  onFilterChange: (name: "page_size" | "search" | "status" | "sort_by" | "sort_order", value: string) => void;
}

export interface ClientChargeSummary {
  id: number;
  charge_type: string;
  status: string;
}
