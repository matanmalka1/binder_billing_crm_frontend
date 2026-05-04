import { useTaxProfile } from '@/features/taxProfile'

export const useAdvanceRateInsights = (clientId: number) => {
  const { profile, updateProfile, isUpdating } = useTaxProfile(clientId)

  const advanceRate = profile?.advance_rate != null ? Number(profile.advance_rate) : null
  const advancePaymentFrequency = profile?.advance_payment_frequency ?? null

  return {
    advanceRate,
    advancePaymentFrequency,
    updateAdvanceRate: (rate: number) => updateProfile({ advance_rate: String(rate) }),
    isUpdatingRate: isUpdating,
  }
}
