import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authorityContactsApi, authorityContactsQK, type AuthorityContactResponse } from "../api";
import { showErrorToast } from "../../../utils/utils";
import { authorityContactSchema, authorityContactDefaults, type AuthorityContactFormValues } from "../schemas";
import { toast } from "../../../utils/toast";

export const useAuthorityContactForm = (
  clientId: number,
  onSuccess: () => void,
  existing?: AuthorityContactResponse | null,
) => {
  const queryClient = useQueryClient();
  const qk = authorityContactsQK.forBusiness(clientId);

  const form = useForm<AuthorityContactFormValues>({
    resolver: zodResolver(authorityContactSchema),
    defaultValues: authorityContactDefaults,
  });

  // Re-populate the form whenever the target contact changes (create → edit or edit → different contact).
  useEffect(() => {
    if (existing) {
      form.reset({
        contact_type: existing.contact_type as AuthorityContactFormValues["contact_type"],
        name: existing.name,
        office: existing.office ?? "",
        phone: existing.phone ?? "",
        email: existing.email ?? "",
        notes: existing.notes ?? "",
      });
    } else {
      form.reset(authorityContactDefaults);
    }
  }, [existing, form]);

  const saveMutation = useMutation({
    mutationFn: (values: AuthorityContactFormValues) => {
      const payload = {
        ...values,
        office: values.office || null,
        phone: values.phone || null,
        email: values.email || null,
        notes: values.notes || null,
      };
      return existing
        ? authorityContactsApi.updateAuthorityContact(existing.id, payload)
        : authorityContactsApi.createAuthorityContact(clientId, payload);
    },
    onSuccess: () => {
      toast.success(existing ? "איש קשר עודכן בהצלחה" : "איש קשר נוצר בהצלחה");
      queryClient.invalidateQueries({ queryKey: qk });
      onSuccess();
    },
    onError: (err) => showErrorToast(err, "שגיאה בשמירת איש קשר"),
  });

  const onSubmit = form.handleSubmit((values) => saveMutation.mutate(values));

  return { form, onSubmit, isSaving: saveMutation.isPending };
};
