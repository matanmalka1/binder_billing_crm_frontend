import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { correspondenceApi } from "../../../api/correspondence.api";
import { getErrorMessage, showErrorToast } from "../../../utils/utils";
import type { CorrespondenceFormValues } from "../components/correspondenceSchema";
import { QK } from "../../../lib/queryKeys";
import { toast } from "../../../utils/toast";

const DEFAULT_PAGE_SIZE = 50;

export const useCorrespondence = (clientId: number) => {
  const queryClient = useQueryClient();
  const qk = [...QK.correspondence.forClient(clientId), { page: 1, page_size: DEFAULT_PAGE_SIZE }];

  const listQuery = useQuery({
    enabled: clientId > 0,
    queryKey: qk,
    queryFn: () =>
      correspondenceApi.list(clientId, { page: 1, page_size: DEFAULT_PAGE_SIZE }),
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
    onError: (err) => showErrorToast(err, "שגיאה בהוספת רשומה"),
  });

  return {
    entries: listQuery.data?.items ?? [],
    total: listQuery.data?.total ?? 0,
    page: listQuery.data?.page ?? 1,
    pageSize: listQuery.data?.page_size ?? DEFAULT_PAGE_SIZE,
    isLoading: listQuery.isPending,
    error: listQuery.error ? getErrorMessage(listQuery.error, "שגיאה בטעינת התכתבויות") : null,
    createEntry: (values: CorrespondenceFormValues) => createMutation.mutate(values),
    isCreating: createMutation.isPending,
  };
};
