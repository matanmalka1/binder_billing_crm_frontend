import type { PagedQueryParams } from "../../types/common";

export interface ChargesFilters extends PagedQueryParams {
  client_id: string;
  status: string;
}
