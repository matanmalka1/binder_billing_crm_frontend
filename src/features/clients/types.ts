import type { ListClientsParams } from "./api";

export interface ClientsFilters extends ListClientsParams {
  search: string;
}

export interface ClientsFiltersBarProps {
  filters: ClientsFilters;
  onFilterChange: (name: "page_size" | "search", value: string) => void;
}

export interface ClientChargeSummary {
  id: number;
  charge_type: string;
  status: string;
}
