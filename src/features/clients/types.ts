import type { ClientResponse, ListClientsParams } from "../../api/clients.api";
import type { ActionCommand } from "../../lib/actions/types";

export interface ClientsFilters extends Omit<ListClientsParams, "has_signals"> {
  has_signals: string;
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
