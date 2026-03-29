import { useQuery } from "@tanstack/react-query";
import { authorityContactsApi, authorityContactsQK } from "../api";

export const useAuthorityContact = (contactId: number) =>
  useQuery({
    queryKey: authorityContactsQK.detail(contactId),
    queryFn: () => authorityContactsApi.getAuthorityContact(contactId),
    enabled: !!contactId,
  });
