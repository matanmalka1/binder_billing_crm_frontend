import type { PagedFilters } from "@/types";

export type ChargesFilters = PagedFilters<{
  client_id: string;
  status: string;
  charge_type: string;
}>;
