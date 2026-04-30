import { useMutation, useQueryClient } from '@tanstack/react-query'
import { clientsApi, clientsQK } from '../api'
import type { UpdateBusinessPayload } from '../api'
import { showErrorToast } from '@/utils/utils'
import { toast } from '@/utils/toast'

export const useBusinessActions = (clientId: number) => {
  const queryClient = useQueryClient()

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: clientsQK.businessesAll(clientId) })
    void queryClient.invalidateQueries({ queryKey: clientsQK.businesses(clientId) })
  }

  const updateMutation = useMutation({
    mutationFn: ({ businessId, payload }: { businessId: number; payload: UpdateBusinessPayload }) =>
      clientsApi.updateBusiness(clientId, businessId, payload),
    onSuccess: () => {
      toast.success('העסק עודכן בהצלחה')
      invalidate()
    },
    onError: (err) => showErrorToast(err, 'שגיאה בעדכון עסק'),
  })

  const deleteMutation = useMutation({
    mutationFn: (businessId: number) => clientsApi.deleteBusiness(clientId, businessId),
    onSuccess: () => {
      toast.success('העסק נמחק בהצלחה')
      invalidate()
    },
    onError: (err) => showErrorToast(err, 'שגיאה במחיקת עסק'),
  })

  return {
    updateBusiness: (businessId: number, payload: UpdateBusinessPayload) =>
      updateMutation.mutateAsync({ businessId, payload }),
    isUpdating: updateMutation.isPending,
    deleteBusiness: (businessId: number) => deleteMutation.mutate(businessId),
    isDeleting: deleteMutation.isPending,
  }
}
