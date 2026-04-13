import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { correspondenceApi, correspondenceQK } from "../api";
import type { UpdateCorrespondencePayload } from "../api";
import { authorityContactsApi, authorityContactsQK } from "@/features/authorityContacts/api";
import { getErrorMessage, showErrorToast } from "../../../utils/utils";
import type { CorrespondenceFormValues } from "../schemas";
import { toast } from "../../../utils/toast";

const PAGE_SIZE = 50;

export const useCorrespondence = (businessId: number | undefined, clientId?: number) => {
  const queryClient = useQueryClient();
  const queryKey = [...correspondenceQK.forBusiness(businessId ?? 0), { page: 1, page_size: PAGE_SIZE }];
  const contactsClientId = clientId ?? businessId ?? 0;

  const listQuery = useQuery({
    enabled: (businessId ?? 0) > 0,
    queryKey,
    queryFn: () => correspondenceApi.list(businessId ?? 0, { page: 1, page_size: PAGE_SIZE }),
    retry: false,
  });

  const contactsQuery = useQuery({
    enabled: contactsClientId > 0,
    queryKey: [...authorityContactsQK.forClient(contactsClientId), { page: 1, page_size: 100 }],
    queryFn: () => authorityContactsApi.listAuthorityContacts(contactsClientId, undefined, 1, 100),
    staleTime: 60_000,
  });

  const createMutation = useMutation({
    mutationFn: (values: CorrespondenceFormValues) =>
      correspondenceApi.create(businessId ?? 0, {
        ...values,
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
      correspondenceApi.update(businessId ?? 0, id, payload),
    onSuccess: () => {
      toast.success("רשומת התכתבות עודכנה בהצלחה");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (err) => showErrorToast(err, "שגיאה בעדכון רשומה"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => correspondenceApi.delete(businessId ?? 0, id),
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
