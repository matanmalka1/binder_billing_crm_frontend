import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../components/ui/primitives/Button";
import { Input } from "../../../components/ui/inputs/Input";
import { Select } from "../../../components/ui/inputs/Select";
import { getVatTypeLabel } from "../../../utils/enums";
import { buildYearOptions } from "../../../utils/utils";
import type { TaxProfileData } from "../hooks/useTaxProfile";
import type { TaxProfileUpdatePayload } from "../types";
import { taxProfileSchema, taxProfileDefaults, type TaxProfileFormValues } from "../schemas";

interface Props {
  profile: TaxProfileData | null;
  onSave: (data: TaxProfileUpdatePayload) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export const TaxProfileForm: React.FC<Props> = ({ profile, onSave, onCancel, isSaving }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<TaxProfileFormValues>({
    resolver: zodResolver(taxProfileSchema),
    defaultValues: profile
      ? {
          vat_reporting_frequency: profile.vat_reporting_frequency ?? taxProfileDefaults.vat_reporting_frequency,
          business_type_label: profile.business_type_label ?? "",
          tax_year_start: profile.tax_year_start ? String(profile.tax_year_start) : "",
          accountant_name: profile.accountant_name ?? "",
          advance_rate: profile.advance_rate != null ? String(profile.advance_rate) : "",
        }
      : taxProfileDefaults,
  });

  const onSubmit = handleSubmit((values) => {
    onSave({
      vat_reporting_frequency: values.vat_reporting_frequency,
      business_type_label: values.business_type_label || null,
      tax_year_start: values.tax_year_start ? Number(values.tax_year_start) : null,
      accountant_name: values.accountant_name || null,
      advance_rate: values.advance_rate || null,
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Select
          label='תדירות דיווח מע"מ'
          error={errors.vat_reporting_frequency?.message}
          disabled={isSaving}
          options={[
            { value: "monthly", label: getVatTypeLabel("monthly") },
            { value: "bimonthly", label: getVatTypeLabel("bimonthly") },
            { value: "exempt", label: getVatTypeLabel("exempt") },
          ]}
          {...register("vat_reporting_frequency")}
        />
        <Input
          label="סוג עסק (תיאור חופשי)"
          error={errors.business_type_label?.message}
          disabled={isSaving}
          {...register("business_type_label")}
        />
        <Select
          label="שנת מס ראשונה"
          error={errors.tax_year_start?.message}
          disabled={isSaving}
          options={[
            { value: "", label: "בחר שנה" },
            ...buildYearOptions(),
          ]}
          {...register("tax_year_start")}
        />
        <Input label="רואה חשבון מלווה" error={errors.accountant_name?.message} {...register("accountant_name")} />
        <Input
          label="אחוז מקדמה (%)"
          type="number"
          min={0}
          max={100}
          step={0.01}
          error={errors.advance_rate?.message}
          {...register("advance_rate")}
        />
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" disabled={isSaving} onClick={onCancel}>
          ביטול
        </Button>
        <Button type="submit" isLoading={isSaving}>
          שמור
        </Button>
      </div>
    </form>
  );
};
