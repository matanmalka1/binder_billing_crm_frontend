import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { signerApi, signatureRequestsQK } from '@/features/signatureRequests'
import type { SignerViewResponse, SignatureRequestStatus } from '@/features/signatureRequests'
import type { SigningPageState } from '../types'

interface UseSigningPageStateResult {
  data?: SignerViewResponse
  status?: SignatureRequestStatus
  effectiveState: SigningPageState
  pageState: SigningPageState
  declineReason: string
  isExpired: boolean
  isApproving: boolean
  isDeclining: boolean
  setDeclineReason: (value: string) => void
  startApprove: () => void
  startDecline: () => void
  backToReady: () => void
  confirmApprove: () => void
  confirmDecline: () => void
}

export const useSigningPageState = (token?: string): UseSigningPageStateResult => {
  const [pageState, setPageState] = useState<SigningPageState>('loading')
  const [declineReason, setDeclineReason] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: signatureRequestsQK.signer(token),
    queryFn: () => signerApi.view(token!),
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
  })

  const approveMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error('Missing signing token')
      }
      return signerApi.approve(token)
    },
    onSuccess: () => setPageState('signed'),
    onError: () => setPageState('error'),
  })

  const declineMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error('Missing signing token')
      }
      return signerApi.decline(token, { reason: declineReason.trim() || undefined })
    },
    onSuccess: () => setPageState('declined'),
    onError: () => setPageState('error'),
  })

  const effectiveState: SigningPageState = (() => {
    if (isLoading) return 'loading'
    if (error || !data) return 'error'
    if (data.status === 'signed') return 'signed'
    if (data.status === 'declined') return 'declined'
    if (data.status === 'expired' || data.status === 'canceled') return 'error'
    return pageState === 'loading' ? 'ready' : pageState
  })()

  const isExpired = data?.is_expired ?? false

  return {
    data,
    status: data?.status,
    effectiveState,
    pageState,
    declineReason,
    isExpired,
    isApproving: approveMutation.isPending,
    isDeclining: declineMutation.isPending,
    setDeclineReason,
    startApprove: () => setPageState('confirming_approve'),
    startDecline: () => setPageState('confirming_decline'),
    backToReady: () => setPageState('ready'),
    confirmApprove: () => approveMutation.mutate(),
    confirmDecline: () => declineMutation.mutate(),
  }
}
