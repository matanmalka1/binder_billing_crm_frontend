import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { correspondenceApi, correspondenceQK } from "../api";
import type { UpdateCorrespondencePayload } from "../api";
import { authorityContactsApi, authorityContactsQK } from "@/features/authorityContacts";
import { getErrorMessage, showErrorToast } from "../../../utils/utils";
import type { CorrespondenceFormValues } from "../schemas";
import { toast } from "../../../utils/toast";
import { PAGE_SIZE_MD as PAGE_SIZE } from "@/constants/pagination.constants";

export const useCorrespondence = (businessId: number | undefined, clientId?: number) => {
  const queryClient = useQueryClient();
  const resolvedClientId = clientId ?? 0;
  const queryKey = [...correspondenceQK.forClient(resolvedClientId), { page: 1, page_size: PAGE_SIZE, business_id: businessId }];

  const listQuery = useQuery({
    enabled: resolvedClientId > 0,
    queryKey,
    queryFn: () => correspondenceApi.list(resolvedClientId, { page: 1, page_size: PAGE_SIZE, business_id: businessId }),
    retry: false,
  });

  const contactsQuery = useQuery({
    enabled: resolvedClientId > 0,
    queryKey: [...authorityContactsQK.forClient(resolvedClientId), { page: 1, page_size: 100 }],
    queryFn: () => authorityContactsApi.listAuthorityContacts(resolvedClientId, undefined, 1, 100),
    staleTime: 60_000,
  });

  const createMutation = useMutation({
    mutationFn: (values: CorrespondenceFormValues) =>
      correspondenceApi.create(resolvedClientId, {
        ...values,
        business_id: businessId ?? null,
        notes: values.notes || null,
        contact_id: values.contact_id ?? null,
      }),
    onSuccess: () => {
      toast.success("רשומת התכתבות נוספה בהצלחה");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (err) => showErrorToast(err, "שגיאה בהוספת רשומה"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCorrespondencePayload }) =>
      correspondenceApi.update(resolvedClientId, id, payload),
    onSuccess: () => {
      toast.success("רשומת התכתבות עודכנה בהצלחה");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (err) => showErrorToast(err, "שגיאה בעדכון רשומה"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => correspondenceApi.delete(resolvedClientId, id),
    onSuccess: () => {
      toast.success("רשומת התכתבות נמחקה בהצלחה");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (err) => showErrorToast(err, "שגיאה במחיקת רשומה"),
  });

  const deletingId = deleteMutation.isPending
    ? (deleteMutation.variables ?? null)
    : null;

  return {
    entries: listQuery.data?.items ?? [],
    total: listQuery.data?.total ?? 0,
    isLoading: listQuery.isLoading,
    error: listQuery.error ? getErrorMessage(listQuery.error, "שגיאה בטעינת התכתבויות") : null,
    contacts: contactsQuery.data?.items ?? [],
    createEntry: (values: CorrespondenceFormValues) => createMutation.mutateAsync(values),
    isCreating: createMutation.isPending,
    updateEntry: (id: number, payload: UpdateCorrespondencePayload) =>
      updateMutation.mutateAsync({ id, payload }),
    isUpdating: updateMutation.isPending,
    deleteEntry: (id: number) => deleteMutation.mutate(id),
    deletingId,
  };
};
