import { useQuery } from "@tanstack/react-query";
import { clientsApi, clientsQK } from "@/features/clients";
import { getErrorMessage, isPositiveInt } from "@/utils/utils";

type UseBusinessDetailsParams = {
  clientId: number | null;
  businessId: number | null;
};

export const useBusinessDetails = ({ clientId, businessId }: UseBusinessDetailsParams) => {
  const clientIdValid = isPositiveInt(clientId);
  const businessIdValid = isPositiveInt(businessId);
  const isValidId = clientIdValid && businessIdValid;

  const clientQuery = useQuery({
    queryKey: clientsQK.detail(clientId!),
    queryFn: () => clientsApi.getById(clientId!),
    enabled: isValidId,
  });

  const businessQuery = useQuery({
    queryKey: clientsQK.businessDetail(clientId ?? "none", businessId ?? "none"),
    queryFn: () => clientsApi.getBusinessById(clientId!, businessId!),
    enabled: isValidId,
  });

  const business =
    businessQuery.data?.client_id === clientId ? businessQuery.data : null;

  const isLoading = clientQuery.isLoading || businessQuery.isLoading;
  const error = clientQuery.error
    ? getErrorMessage(clientQuery.error, "שגיאה בטעינת פרטי לקוח")
    : businessQuery.error
    ? getErrorMessage(businessQuery.error, "שגיאה בטעינת פרטי עסק")
    : businessQuery.data && businessQuery.data.client_id !== clientId
    ? "העסק אינו שייך ללקוח שנבחר"
    : null;

  return {
    client: clientQuery.data ?? null,
    business,
    isLoading,
    error,
    isValidId,
  };
};
