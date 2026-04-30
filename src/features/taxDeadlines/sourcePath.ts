import type { TaxDeadlineResponse } from './api'

export const getTaxDeadlineSourcePath = (deadline: TaxDeadlineResponse): string | null => {
  const clientId = deadline.client_record_id
  if (!clientId) return null
  if (deadline.deadline_type === 'vat') {
    return deadline.vat_work_item_id
      ? `/tax/vat/${deadline.vat_work_item_id}`
      : `/clients/${clientId}/vat`
  }
  if (deadline.deadline_type === 'advance_payment') return `/clients/${clientId}/advance-payments`
  if (deadline.deadline_type === 'annual_report') return `/clients/${clientId}/annual-reports`
  return null
}
