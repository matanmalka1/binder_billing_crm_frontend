import { useQuery } from "@tanstack/react-query";
import { authorityContactsApi } from "../api";
import { QK } from "../../../lib/queryKeys";

export const useAuthorityContact = (contactId: number) =>
  useQuery({
    queryKey: QK.authorityContacts.detail(contactId),
    queryFn: () => authorityContactsApi.getAuthorityContact(contactId),
    enabled: !!contactId,
  });
