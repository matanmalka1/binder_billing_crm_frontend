import { useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clientsApi, clientsQK } from '../api'
import type { CreateBusinessPayload } from '../api'
import { chargesApi, chargesQK } from '@/features/charges'
import type { CreateChargePayload } from '@/features/charges'
import { bindersApi, bindersQK } from '@/features/binders'
import { showErrorToast } from '@/utils/utils'
import { toast } from '@/utils/toast'

const RELATED_PAGE_SIZE = 5

export const useClientDetailsActions = (clientId: number, activeTab: string) => {
  const queryClient = useQueryClient()

  const relatedBindersQuery = useQuery({
    queryKey: bindersQK.forClientPage(clientId, 1, RELATED_PAGE_SIZE),
    queryFn: () =>
      bindersApi.listClientBinders(clientId, { page: 1, page_size: RELATED_PAGE_SIZE }),
    enabled: activeTab === 'details',
  })

  const relatedChargesQuery = useQuery({
    queryKey: chargesQK.forClientPage(clientId, 1, RELATED_PAGE_SIZE),
    queryFn: () =>
      chargesApi.list({ client_record_id: clientId, page: 1, page_size: RELATED_PAGE_SIZE }),
    enabled: activeTab === 'details',
  })

  const createBusinessMutation = useMutation({
    mutationFn: (payload: CreateBusinessPayload) => clientsApi.createBusiness(clientId, payload),
    onSuccess: () => {
      toast.success('העסק נוצר בהצלחה')
      void queryClient.invalidateQueries({ queryKey: clientsQK.businessesAll(clientId) })
      void queryClient.invalidateQueries({ queryKey: clientsQK.businesses(clientId) })
    },
    onError: (err) => showErrorToast(err, 'שגיאה ביצירת עסק'),
  })

  const createChargeMutation = useMutation({
    mutationFn: (payload: CreateChargePayload) => chargesApi.create(payload),
    onSuccess: async () => {
      toast.success('חיוב נוצר בהצלחה')
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: chargesQK.all }),
        queryClient.invalidateQueries({
          queryKey: chargesQK.forClientPage(clientId, 1, RELATED_PAGE_SIZE),
        }),
      ])
    },
    onError: (err) => showErrorToast(err, 'שגיאה ביצירת חיוב'),
  })

  const handleCreateBusiness = useCallback(
    async (payload: CreateBusinessPayload): Promise<void> => {
      await createBusinessMutation.mutateAsync(payload)
    },
    [createBusinessMutation],
  )

  const handleCreateCharge = useCallback(
    async (payload: CreateChargePayload): Promise<boolean> => {
      try {
        await createChargeMutation.mutateAsync(payload)
        return true
      } catch {
        return false
      }
    },
    [createChargeMutation],
  )

  return {
    binders: relatedBindersQuery.data?.items ?? [],
    bindersTotal: relatedBindersQuery.data?.total ?? 0,
    charges: relatedChargesQuery.data?.items ?? [],
    chargesTotal: relatedChargesQuery.data?.total ?? 0,
    handleCreateBusiness,
    isCreatingBusiness: createBusinessMutation.isPending,
    handleCreateCharge,
    isCreatingCharge: createChargeMutation.isPending,
    createChargeError: createChargeMutation.error,
  }
}
