import { useQuery } from '@tanstack/react-query'
import { signatureRequestsApi, signatureRequestsQK } from '../api'
import type { SignatureRequestResponse } from '../api'
import { getErrorMessage } from '../../../utils/utils'

type Params = { clientId: number | null; page?: number; pageSize?: number }

type Result = {
  items: SignatureRequestResponse[]
  total: number
  isLoading: boolean
  error: string | null
}

export const useClientSignatureRequests = ({
  clientId,
  page = 1,
  pageSize = 10,
}: Params): Result => {
  const enabled = clientId != null && clientId > 0

  const query = useQuery({
    queryKey: signatureRequestsQK.forClientPage(clientId ?? 0, { page, page_size: pageSize }),
    queryFn: () => signatureRequestsApi.listForClient(clientId!, { page, page_size: pageSize }),
    enabled,
  })

  return {
    items: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    error: query.error ? getErrorMessage(query.error, 'שגיאה בטעינת בקשות חתימה') : null,
  }
}
