import { useQuery } from "@tanstack/react-query";
import { clientsApi, clientsQK } from "@/features/clients/api";
import { getErrorMessage } from "@/utils/utils";
import { useRole } from "@/hooks/useRole";

type UseBusinessDetailsParams = {
  clientId: number | null;
  businessId: number | null;
};

export const useBusinessDetails = ({ clientId, businessId }: UseBusinessDetailsParams) => {
  const clientIdValid = clientId != null && Number.isFinite(clientId) && clientId > 0;
  const businessIdValid = businessId != null && Number.isFinite(businessId) && businessId > 0;
  const isValidId = clientIdValid && businessIdValid;
  const { can } = useRole();

  const clientQuery = useQuery({
    queryKey: clientsQK.detail(clientId!),
    queryFn: () => clientsApi.getById(clientId!),
    enabled: isValidId,
  });

  const businessesQuery = useQuery({
    queryKey: clientsQK.businesses(clientId!),
    queryFn: () => clientsApi.listBusinessesForClient(clientId!),
    enabled: isValidId,
  });

  const business =
    businessesQuery.data?.items.find((b) => b.id === businessId) ?? null;

  const isLoading = clientQuery.isLoading || businessesQuery.isLoading;
  const error = clientQuery.error
    ? getErrorMessage(clientQuery.error, "שגיאה בטעינת פרטי לקוח")
    : businessesQuery.error
    ? getErrorMessage(businessesQuery.error, "שגיאה בטעינת פרטי עסק")
    : null;

  return {
    client: clientQuery.data ?? null,
    business,
    isLoading,
    error,
    isValidId,
    can,
  };
};
