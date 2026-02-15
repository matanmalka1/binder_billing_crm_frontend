import type { ClientResponse } from "../../api/clients.api";
import type { PagedQueryParams } from "../../types/common";
import type { ActionCommand } from "../../lib/actions/types";

export interface ClientsFilters extends PagedQueryParams {
  has_signals: string;
  status: string;
}

export interface ClientsFiltersBarProps {
  filters: ClientsFilters;
  onFilterChange: (name: "has_signals" | "status" | "page_size", value: string) => void;
}

export interface ClientsTableCardProps {
  clients: ClientResponse[];
  activeActionKey: string | null;
  onActionClick: (action: ActionCommand) => void;
}
