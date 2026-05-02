import { useQuery } from '@tanstack/react-query'
import type { ReminderType } from '../api'
import { bindersApi, bindersQK } from '@/features/binders'
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

  const needsBinders = base && reminderType === 'binder_idle'
  const needsBusinesses = base && reminderType === 'document_missing'

  const bindersQuery = useQuery({
    queryKey: bindersQK.forClient(clientId!),
    queryFn: () =>
      bindersApi.list({
        client_record_id: clientId!,
        page_size: LINKED_ENTITY_PAGE_SIZE,
      }),
    enabled: needsBinders,
  })

  const businessesQuery = useQuery({
    queryKey: clientsQK.businessesAll(clientId!),
    queryFn: () => clientsApi.listAllBusinessesForClient(clientId!),
    enabled: needsBusinesses,
  })

  return {
    clientBinders: bindersQuery.data?.items,
    clientBusinesses: businessesQuery.data?.items,
  }
}
