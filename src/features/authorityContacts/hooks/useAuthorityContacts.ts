import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authorityContactsApi, authorityContactsQK } from "../api";
import { getErrorMessage, showErrorToast } from "../../../utils/utils";
import { toast } from "../../../utils/toast";
import { PAGE_SIZE_SM as PAGE_SIZE } from "@/constants/pagination.constants";
import { AUTHORITY_CONTACT_TEXT } from "../constants";

export const useAuthorityContacts = (clientId: number) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const qk = [...authorityContactsQK.forClient(clientId), { page, page_size: PAGE_SIZE }];

  const listQuery = useQuery({
    enabled: clientId > 0,
    queryKey: qk,
    queryFn: () => authorityContactsApi.listAuthorityContacts(clientId, undefined, page, PAGE_SIZE),
  });

  const deleteMutation = useMutation({
    mutationFn: (contactId: number) => authorityContactsApi.deleteAuthorityContact(contactId),
    onSuccess: () => {
      toast.success(AUTHORITY_CONTACT_TEXT.deleteSuccess);
      queryClient.invalidateQueries({ queryKey: authorityContactsQK.forClient(clientId) });
    },
    onError: (err) => showErrorToast(err, AUTHORITY_CONTACT_TEXT.deleteError),
  });

  const total = listQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return {
    contacts: listQuery.data?.items ?? [],
    total,
    page,
    setPage,
    totalPages,
    isLoading: listQuery.isLoading,
    error: listQuery.error ? getErrorMessage(listQuery.error, AUTHORITY_CONTACT_TEXT.loadError) : null,
    deleteContact: (id: number) => deleteMutation.mutate(id),
    deletingId: deleteMutation.isPending ? (deleteMutation.variables ?? null) : null,
  };
};
