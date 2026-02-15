import type { ClientResponse } from "../../api/clients.api";
import type { ActionCommand } from "../../lib/actions/types";

export interface ClientsFilters {
  has_signals: string;
  status: string;
  page_size: string;
}

export interface ClientsFiltersBarProps {
  filters: ClientsFilters;
  onFilterChange: (name: keyof ClientsFilters, value: string) => void;
}

export interface ClientsTableCardProps {
  clients: ClientResponse[];
  activeActionKey: string | null;
  onActionClick: (action: ActionCommand) => void;
}
