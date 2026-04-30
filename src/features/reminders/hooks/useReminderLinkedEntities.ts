import { useQuery } from '@tanstack/react-query'
import type { ReminderType } from '../api'
import { bindersApi, bindersQK } from '@/features/binders'
import { chargesApi, chargesQK } from '@/features/charges'
import { taxDeadlinesApi, taxDeadlinesQK } from '@/features/taxDeadlines'
import { annualReportsApi, annualReportsQK } from '@/features/annualReports'
import { advancePaymentsApi, advancedPaymentsQK } from '@/features/advancedPayments'
import { clientsApi, clientsQK } from '@/features/clients'
import { LINKED_ENTITY_PAGE_SIZE } from '../constants'

/**
 * Lazily fetches the entities needed to populate linked-entity dropdowns in the
 * create-reminder modal. Each query is enabled only when the modal is open, a
 * client is selected, and the current reminder type actually requires that entity.
 */
export const useReminderLinkedEntities = (
  clientId: number | undefined,
  reminderType: ReminderType | string,
  enabled: boolean,
) => {
  const base = enabled && !!clientId

  const needsTaxDeadlines =
    base && (reminderType === 'tax_deadline_approaching' || reminderType === 'vat_filing')
  const needsBinders = base && reminderType === 'binder_idle'
  const needsCharges = base && reminderType === 'unpaid_charge'
  const needsAnnualReports = base && reminderType === 'annual_report_deadline'
  const needsAdvancePayments = base && reminderType === 'advance_payment_due'
  const needsBusinesses =
    base &&
    (reminderType === 'advance_payment_due' ||
      reminderType === 'document_missing' ||
      reminderType === 'unpaid_charge')

  const bindersQuery = useQuery({
    queryKey: bindersQK.forClient(clientId!),
    queryFn: () =>
      bindersApi.list({
        client_record_id: clientId!,
        page_size: LINKED_ENTITY_PAGE_SIZE,
      }),
    enabled: needsBinders,
  })

  const chargesQuery = useQuery({
    queryKey: chargesQK.list({
      client_record_id: clientId!,
      page_size: LINKED_ENTITY_PAGE_SIZE,
    }),
    queryFn: () =>
      chargesApi.list({
        client_record_id: clientId!,
        page_size: LINKED_ENTITY_PAGE_SIZE,
      }),
    enabled: needsCharges,
  })

  const taxDeadlinesQuery = useQuery({
    queryKey: taxDeadlinesQK.list({
      client_record_id: clientId!,
      page_size: LINKED_ENTITY_PAGE_SIZE,
    }),
    queryFn: () =>
      taxDeadlinesApi.listTaxDeadlines({
        client_record_id: clientId!,
        page_size: LINKED_ENTITY_PAGE_SIZE,
      }),
    enabled: needsTaxDeadlines,
  })

  const annualReportsQuery = useQuery({
    queryKey: annualReportsQK.forClient(clientId!),
    queryFn: () => annualReportsApi.listClientReports(clientId!),
    enabled: needsAnnualReports,
  })

  const advancePaymentsQuery = useQuery({
    queryKey: advancedPaymentsQK.forClient(clientId!),
    queryFn: () => advancePaymentsApi.listAllForClient(clientId!),
    enabled: needsAdvancePayments,
  })

  const businessesQuery = useQuery({
    queryKey: clientsQK.businessesAll(clientId!),
    queryFn: () => clientsApi.listAllBusinessesForClient(clientId!),
    enabled: needsBusinesses,
  })

  return {
    clientBinders: bindersQuery.data?.items,
    clientCharges: chargesQuery.data?.items,
    clientTaxDeadlines: taxDeadlinesQuery.data?.items,
    clientAnnualReports: annualReportsQuery.data,
    clientAdvancePayments: advancePaymentsQuery.data?.items,
    clientBusinesses: businessesQuery.data?.items,
  }
}
