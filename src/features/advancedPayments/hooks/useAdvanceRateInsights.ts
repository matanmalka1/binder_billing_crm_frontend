import { useQuery } from "@tanstack/react-query";
import { advancePaymentsApi, advancedPaymentsQK } from "../api";
import { useTaxProfile } from "@/features/taxProfile";

export const useAdvanceRateInsights = (businessId: number, year: number) => {
  const { profile, updateProfile, isUpdating } = useTaxProfile(businessId);
  const { data: suggestion } = useQuery({
    queryKey: advancedPaymentsQK.suggestion(businessId, year),
    queryFn: () => advancePaymentsApi.getSuggestion(businessId, year),
    enabled: businessId > 0 && year > 0,
    staleTime: 60_000,
  });

  const advanceRate = profile?.advance_rate ?? null;
  const annualIncome = suggestion?.has_data && suggestion.suggested_amount != null && advanceRate
    ? (Number(suggestion.suggested_amount) * 12 * 100) / advanceRate
    : null;

  return {
    advanceRate,
    annualIncome,
    updateAdvanceRate: (rate: number) => updateProfile({ advance_rate: rate }),
    isUpdatingRate: isUpdating,
  };
};
