import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authorityContactsApi } from "../../../api/authorityContacts.api";
import { toast } from "../../../utils/toast";
import { getErrorMessage } from "../../../utils/utils";
import { QK } from "../../../lib/queryKeys";

export const useAuthorityContacts = (clientId: number) => {
  const queryClient = useQueryClient();
  const qk = QK.authorityContacts.forClient(clientId);

  const listQuery = useQuery({
    enabled: clientId > 0,
    queryKey: qk,
    queryFn: () => authorityContactsApi.listAuthorityContacts(clientId),
  });

  const deleteMutation = useMutation({
    mutationFn: (contactId: number) =>
      authorityContactsApi.deleteAuthorityContact(contactId),
    onSuccess: () => {
      toast.success("איש קשר נמחק בהצלחה");
      queryClient.invalidateQueries({ queryKey: qk });
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, "שגיאה במחיקת איש קשר")),
  });

  return {
    contacts: listQuery.data?.items ?? [],
    isLoading: listQuery.isPending,
    error: listQuery.error
      ? getErrorMessage(listQuery.error, "שגיאה בטעינת אנשי קשר")
      : null,
    deleteContact: (id: number) => deleteMutation.mutate(id),
    isDeleting: deleteMutation.isPending,
    deletingId: deleteMutation.isPending ? (deleteMutation.variables ?? null) : null,
  };
};
