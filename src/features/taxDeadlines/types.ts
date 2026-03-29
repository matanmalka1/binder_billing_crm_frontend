import type { PagedFilters } from "@/types";

export type TaxDeadlineFilters = PagedFilters<{
  client_name: string;
  deadline_type: string;
  status: string;
}>;

export interface TaxDeadlineFormValues {
  deadline_type: string;
  due_date: string;
  payment_amount: string;
  description: string;
}

export interface CreateTaxDeadlineForm extends TaxDeadlineFormValues {
  client_id: string;
}

export interface EditTaxDeadlineForm extends TaxDeadlineFormValues {}
