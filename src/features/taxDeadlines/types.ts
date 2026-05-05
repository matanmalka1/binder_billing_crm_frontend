import type { PagedFilters } from '@/types'

export type TaxDeadlineFilters = PagedFilters<{
  client_id: string
  client_name: string
  deadline_type: string
  status: string
  due_from: string
  due_to: string
}>

export interface TaxDeadlineFormValues {
  deadline_type: string
  due_date: string
  period: string
  payment_amount: string
  description: string
}

export interface CreateTaxDeadlineForm extends TaxDeadlineFormValues {
  client_id: string
}

export type EditTaxDeadlineForm = TaxDeadlineFormValues

export interface GenerateTaxDeadlinesForm {
  client_id: string
  year: string
}
