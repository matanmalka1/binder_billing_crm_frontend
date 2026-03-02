import type { PagedFilters } from "../../types/filters";

export type TaxDeadlineFilters = PagedFilters<{
  client_id: string;
  deadline_type: string;
  status: string;
}>;

export interface CreateTaxDeadlineForm {
  client_id: string;
  deadline_type: string;
  due_date: string;
  payment_amount: string;
  description: string;
}
