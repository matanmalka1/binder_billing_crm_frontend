import { useQuery } from "@tanstack/react-query";
import { authorityContactsApi, authorityContactsQK } from "@/features/authorityContacts";

const PAGE = 1;
const PAGE_SIZE = 20;

export const useClientAuthorityContacts = (clientId: number) => {
  const { data } = useQuery({
    queryKey: [...authorityContactsQK.forClient(clientId), { page: PAGE, page_size: PAGE_SIZE }],
    queryFn: () => authorityContactsApi.listAuthorityContacts(clientId, undefined, PAGE, PAGE_SIZE),
    enabled: clientId > 0,
    staleTime: 60_000,
  });

  const contacts = data?.items ?? [];

  const officeByType = (type: string): string | null =>
    contacts.find((c) => c.contact_type === type)?.office ?? null;

  return { officeByType };
};
