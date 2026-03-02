import type { PagedFilters } from "../../types/filters";

export type ChargesFilters = PagedFilters<{
  client_id: string;
  status: string;
}>;
