import { useQuery } from "@tanstack/react-query";
import { advancePaymentsApi } from "../../../api/advancePayments.api";
import { useTaxProfile } from "../../taxProfile/hooks/useTaxProfile";
import { QK } from "../../../lib/queryKeys";

export const useAdvanceRateInsights = (clientId: number, year: number) => {
  const { profile, updateProfile, isUpdating } = useTaxProfile(clientId);
  const { data: suggestion } = useQuery({
    queryKey: QK.tax.advancePayments.suggestion(clientId, year),
    queryFn: () => advancePaymentsApi.getSuggestion(clientId, year),
    enabled: clientId > 0 && year > 0,
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
