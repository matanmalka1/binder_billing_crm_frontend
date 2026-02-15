export interface TaxDeadlineFilters {
  client_id: string;
  deadline_type: string;
  status: string;
  page: number;
  page_size: number;
}

export interface CreateTaxDeadlineForm {
  client_id: string;
  deadline_type: string;
  due_date: string;
  payment_amount: string;
  description: string;
}
