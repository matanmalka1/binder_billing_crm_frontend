import { useQueryClient } from '@tanstack/react-query'
import { taxDeadlinesQK } from '../api'
import { useTaxDeadlineActions } from './useTaxDeadlineActions'

export const useClientDeadlineActions = (clientRecordId: number) => {
  const queryClient = useQueryClient()

  return useTaxDeadlineActions({
    invalidateAfterMutation: () => {
      queryClient.invalidateQueries({ queryKey: taxDeadlinesQK.all })
      queryClient.invalidateQueries({
        queryKey: taxDeadlinesQK.list({ client_record_id: clientRecordId }),
      })
      queryClient.invalidateQueries({ queryKey: taxDeadlinesQK.timeline(clientRecordId) })
    },
  })
}
