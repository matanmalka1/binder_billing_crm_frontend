import type { UseFormReturn } from "react-hook-form";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/Textarea";
import { AUTHORITY_CONTACT_TYPE_OPTIONS } from "../api";
import type { AuthorityContactFormValues } from "../schemas";

interface AuthorityContactFormFieldsProps {
  form: UseFormReturn<AuthorityContactFormValues>;
}

export const AuthorityContactFormFields: React.FC<AuthorityContactFormFieldsProps> = ({
  form,
}) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <>
      <Select
        label="סוג גורם *"
        error={errors.contact_type?.message}
        {...register("contact_type")}
      >
        {AUTHORITY_CONTACT_TYPE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Input label="שם *" error={errors.name?.message} {...register("name")} />
      <Input label="משרד / סניף" error={errors.office?.message} {...register("office")} />
      <Input label="טלפון" type="tel" error={errors.phone?.message} {...register("phone")} />
      <Input label="אימייל" type="email" error={errors.email?.message} {...register("email")} />
      <Textarea label="הערות" rows={3} error={errors.notes?.message} {...register("notes")} />
    </>
  );
};
