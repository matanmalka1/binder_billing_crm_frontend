import { useSearchParamFilters } from '../../../hooks/useSearchParamFilters'
import { parsePositiveInt } from '../../../utils/utils'
import { useBinderDetail } from './useBinderDetail'
import type { BinderResponse } from '../types'

export const useBinderSelection = (pageItems: BinderResponse[]) => {
  const { searchParams, setSearchParams } = useSearchParamFilters()

  const deepLinkBinderId = parsePositiveInt(searchParams.get('binder_id'), 0) || undefined

  const pageMatch = pageItems.find((b) => b.id === deepLinkBinderId) ?? null
  const needsFallback = deepLinkBinderId !== undefined && pageMatch === null
  const binderDetailQuery = useBinderDetail(needsFallback ? (deepLinkBinderId ?? null) : null)
  const selectedBinder = pageMatch ?? binderDetailQuery.data ?? null

  const handleSelectBinder = (binder: { id: number }) => {
    const next = new URLSearchParams(searchParams)
    next.set('binder_id', String(binder.id))
    setSearchParams(next, { replace: true })
  }

  const handleCloseDrawer = () => {
    const next = new URLSearchParams(searchParams)
    next.delete('binder_id')
    setSearchParams(next, { replace: true })
  }

  return { deepLinkBinderId, selectedBinder, handleSelectBinder, handleCloseDrawer }
}
