import type { UseFormReturn } from "react-hook-form";
import { Input } from "../../../components/ui/inputs/Input";
import { Select } from "../../../components/ui/inputs/Select";
import { Textarea } from "../../../components/ui/inputs/Textarea";
import { AUTHORITY_CONTACT_TYPE_OPTIONS } from "../api";
import type { AuthorityContactFormValues } from "../schemas";

interface AuthorityContactFormFieldsProps {
  form: UseFormReturn<AuthorityContactFormValues>;
}

const AUTHORITY_CONTACT_PLACEHOLDERS = {
  assessing_officer: {
    name: "לדוגמה: פקיד שומה אילת",
    office: "לדוגמה: אילת",
  },
  vat_branch: {
    name: 'לדוגמה: מע"מ אילת',
    office: "לדוגמה: אילת",
  },
  national_insurance: {
    name: "לדוגמה: ביטוח לאומי אילת",
    office: "לדוגמה: אילת",
  },
  other: {
    name: "לדוגמה: רשות / גורם מטפל",
    office: "לדוגמה: מחוז דרום",
  },
} as const satisfies Record<AuthorityContactFormValues["contact_type"], { name: string; office: string }>;

export const AuthorityContactFormFields: React.FC<AuthorityContactFormFieldsProps> = ({
  form,
}) => {
  const {
    register,
    watch,
    formState: { errors },
  } = form;
  const contactType = watch("contact_type");
  const placeholders = AUTHORITY_CONTACT_PLACEHOLDERS[contactType];

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
      <Input
        label="שם *"
        placeholder={placeholders.name}
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="משרד / סניף"
        placeholder={placeholders.office}
        error={errors.office?.message}
        {...register("office")}
      />
      <Input
        label="טלפון"
        type="tel"
        dir="rtl"
        placeholder="לדוגמה: 08-1234567"
        error={errors.phone?.message}
        {...register("phone")}
      />
      <Input
        label="אימייל"
        type="email"
        placeholder="לדוגמה: office@example.gov.il"
        error={errors.email?.message}
        {...register("email")}
      />
      <Textarea
        label="הערות"
        rows={3}
        placeholder="הערות פנימיות לצוות"
        error={errors.notes?.message}
        {...register("notes")}
      />
    </>
  );
};
