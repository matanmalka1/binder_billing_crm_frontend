import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authorityContactsApi, type AuthorityContactResponse } from "../../../api/authorityContacts.api";
import { toast } from "../../../utils/toast";
import { getErrorMessage } from "../../../utils/utils";
import {
  authorityContactSchema,
  authorityContactDefaults,
  type AuthorityContactFormValues,
} from "../components/authorityContactSchema.ts";
import { QK } from "../../../lib/queryKeys";

export const useAuthorityContactForm = (
  clientId: number,
  onSuccess: () => void,
  existing?: AuthorityContactResponse | null,
) => {
  const queryClient = useQueryClient();
  const qk = QK.authorityContacts.forClient(clientId);

  const form = useForm<AuthorityContactFormValues>({
    resolver: zodResolver(authorityContactSchema),
    defaultValues: existing
      ? {
          contact_type: existing.contact_type as AuthorityContactFormValues["contact_type"],
          name: existing.name,
          office: existing.office ?? "",
          phone: existing.phone ?? "",
          email: existing.email ?? "",
          notes: existing.notes ?? "",
        }
      : authorityContactDefaults,
  });

  const saveMutation = useMutation({
    mutationFn: (values: AuthorityContactFormValues) => {
      const payload = {
        ...values,
        office: values.office || null,
        phone: values.phone || null,
        email: values.email || null,
        notes: values.notes || null,
      };
      if (existing) {
        return authorityContactsApi.updateAuthorityContact(existing.id, payload);
      }
      return authorityContactsApi.createAuthorityContact(clientId, payload);
    },
    onSuccess: () => {
      toast.success(existing ? "איש קשר עודכן בהצלחה" : "איש קשר נוצר בהצלחה");
      queryClient.invalidateQueries({ queryKey: qk });
      onSuccess();
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, "שגיאה בשמירת איש קשר")),
  });

  const onSubmit = form.handleSubmit((values) => saveMutation.mutate(values));

  return { form, onSubmit, isSaving: saveMutation.isPending };
};
