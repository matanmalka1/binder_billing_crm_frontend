import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../api/client";
import { ENDPOINTS } from "../../../api/endpoints";
import { toast } from "../../../utils/toast";
import { getErrorMessage } from "../../../utils/utils";
import { QK } from "../../../lib/queryKeys";

export interface TaxProfileData {
  vat_type: "monthly" | "bimonthly" | "exempt" | null;
  business_type: string | null;
  tax_year_start: number | null;
  accountant_name: string | null;
}

const fetchTaxProfile = async (clientId: number): Promise<TaxProfileData> => {
  const response = await api.get<TaxProfileData>(ENDPOINTS.clientTaxProfile(clientId));
  return response.data;
};

const updateTaxProfile = async (clientId: number, data: Partial<TaxProfileData>): Promise<TaxProfileData> => {
  const response = await api.patch<TaxProfileData>(ENDPOINTS.clientTaxProfile(clientId), data);
  return response.data;
};

export const useTaxProfile = (clientId: number) => {
  const queryClient = useQueryClient();
  const qk = QK.clients.taxProfile(clientId);

  const profileQuery = useQuery({
    enabled: clientId > 0,
    queryKey: qk,
    queryFn: () => fetchTaxProfile(clientId),
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<TaxProfileData>) => updateTaxProfile(clientId, data),
    onSuccess: (updated) => {
      toast.success("פרטי מס עודכנו בהצלחה");
      queryClient.setQueryData(qk, updated);
    },
    onError: (err) => toast.error(getErrorMessage(err, "שגיאה בעדכון פרטי מס")),
  });

  return {
    profile: profileQuery.data ?? null,
    isLoading: profileQuery.isPending,
    error: profileQuery.error ? getErrorMessage(profileQuery.error, "שגיאה בטעינת פרטי מס") : null,
    updateProfile: (data: Partial<TaxProfileData>) => updateMutation.mutate(data),
    isUpdating: updateMutation.isPending,
  };
};
