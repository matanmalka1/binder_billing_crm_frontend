import { useTaxProfile } from '@/features/taxProfile'

export const useAdvanceRateInsights = (clientId: number) => {
  const { profile, updateProfile, isUpdating } = useTaxProfile(clientId)

  const advanceRate = profile?.advance_rate != null ? Number(profile.advance_rate) : null
  const vatType = profile?.vat_reporting_frequency ?? null

  return {
    advanceRate,
    vatType,
    updateAdvanceRate: (rate: number) => updateProfile({ advance_rate: String(rate) }),
    isUpdatingRate: isUpdating,
  }
}
