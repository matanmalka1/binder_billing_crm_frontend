import { useTaxProfile } from "@/features/taxProfile";

export const useAdvanceRateInsights = (businessId: number) => {
  const { profile, updateProfile, isUpdating } = useTaxProfile(businessId);

  const advanceRate = profile?.advance_rate ?? null;

  return {
    advanceRate,
    updateAdvanceRate: (rate: number) => updateProfile({ advance_rate: rate }),
    isUpdatingRate: isUpdating,
  };
};
