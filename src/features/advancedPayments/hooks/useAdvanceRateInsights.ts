import { useTaxProfile } from "@/features/taxProfile";

export const useAdvanceRateInsights = (businessId: number) => {
  const { profile, updateProfile, isUpdating } = useTaxProfile(businessId);

  const advanceRate =
    profile?.advance_rate != null ? Number(profile.advance_rate) : null;
  const vatType = profile?.vat_type ?? null;

  return {
    advanceRate,
    vatType,
    updateAdvanceRate: (rate: number) => updateProfile({ advance_rate: rate }),
    isUpdatingRate: isUpdating,
  };
};
