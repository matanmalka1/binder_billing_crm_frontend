import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taxProfileApi, type TaxProfileData } from "../api";
import { toast } from "../../../utils/toast";
import { getErrorMessage, showErrorToast } from "../../../utils/utils";
import { QK } from "../../../lib/queryKeys";

export type { TaxProfileData };

export const useTaxProfile = (businessId: number) => {
  const queryClient = useQueryClient();
  const qk = QK.clients.taxProfile(businessId);

  const profileQuery = useQuery({
    enabled: businessId > 0,
    queryKey: qk,
    queryFn: () => taxProfileApi.get(businessId),
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<TaxProfileData>) => taxProfileApi.update(businessId, data),
    onSuccess: (updated) => {
      toast.success("פרטי מס עודכנו בהצלחה");
      queryClient.setQueryData(qk, updated);
    },
    onError: (err) => showErrorToast(err, "שגיאה בעדכון פרטי מס"),
  });

  return {
    profile: profileQuery.data ?? null,
    isLoading: profileQuery.isPending,
    error: profileQuery.error ? getErrorMessage(profileQuery.error, "שגיאה בטעינת פרטי מס") : null,
    updateProfile: (data: Partial<TaxProfileData>) => updateMutation.mutate(data),
    isUpdating: updateMutation.isPending,
  };
};
