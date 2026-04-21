import type { PagedFilters } from "@/types";

export type ChargesFilters = PagedFilters<{
  client_record_id: string;
  status: string;
  charge_type: string;
}>;
