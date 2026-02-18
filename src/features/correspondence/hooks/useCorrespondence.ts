import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { correspondenceApi } from "../../../api/correspondence.api";
import { toast } from "../../../utils/toast";
import { getErrorMessage } from "../../../utils/utils";
import type { CorrespondenceFormValues } from "../components/correspondenceSchema";
import { QK } from "../../../lib/queryKeys";

export const useCorrespondence = (clientId: number) => {
  const queryClient = useQueryClient();
  const qk = QK.correspondence.forClient(clientId);

  const listQuery = useQuery({
    enabled: clientId > 0,
    queryKey: qk,
    queryFn: () => correspondenceApi.list(clientId),
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: (values: CorrespondenceFormValues) =>
      correspondenceApi.create(clientId, {
        ...values,
        notes: values.notes || null,
        occurred_at: values.occurred_at,
      }),
    onSuccess: () => {
      toast.success("רשומת התכתבות נוספה בהצלחה");
      queryClient.invalidateQueries({ queryKey: qk });
    },
    onError: (err) => toast.error(getErrorMessage(err, "שגיאה בהוספת רשומה")),
  });

  return {
    entries: listQuery.data?.items ?? [],
    isLoading: listQuery.isPending,
    error: listQuery.error ? getErrorMessage(listQuery.error, "שגיאה בטעינת התכתבויות") : null,
    createEntry: (values: CorrespondenceFormValues) => createMutation.mutate(values),
    isCreating: createMutation.isPending,
  };
};
