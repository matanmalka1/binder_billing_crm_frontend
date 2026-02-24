import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { correspondenceApi } from "../../../api/correspondence.api";
import { getErrorMessage, showErrorToast } from "../../../utils/utils";
import type { CorrespondenceFormValues } from "../schemas";
import { QK } from "../../../lib/queryKeys";
import { toast } from "../../../utils/toast";

const PAGE_SIZE = 50;

export const useCorrespondence = (clientId: number) => {
  const queryClient = useQueryClient();
  const queryKey = [...QK.correspondence.forClient(clientId), { page: 1, page_size: PAGE_SIZE }];

  const listQuery = useQuery({
    enabled: clientId > 0,
    queryKey,
    queryFn: () => correspondenceApi.list(clientId, { page: 1, page_size: PAGE_SIZE }),
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: (values: CorrespondenceFormValues) =>
      correspondenceApi.create(clientId, {
        ...values,
        notes: values.notes || null,
      }),
    onSuccess: () => {
      toast.success("רשומת התכתבות נוספה בהצלחה");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (err) => showErrorToast(err, "שגיאה בהוספת רשומה"),
  });

  return {
    entries: listQuery.data?.items ?? [],
    total: listQuery.data?.total ?? 0,
    isLoading: listQuery.isPending,
    error: listQuery.error ? getErrorMessage(listQuery.error, "שגיאה בטעינת התכתבויות") : null,
    createEntry: (values: CorrespondenceFormValues) => createMutation.mutateAsync(values),
    isCreating: createMutation.isPending,
  };
};