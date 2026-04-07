import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../components/ui/primitives/Button";
import { Input } from "../../../components/ui/inputs/Input";
import { Select } from "../../../components/ui/inputs/Select";
import { BUSINESS_TYPE_LABELS, BUSINESS_TYPES } from "../../clients/constants";
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
  const isOsekMurshe = profile?.business_type_key === "osek_murshe";
  const { register, handleSubmit, formState: { errors } } = useForm<TaxProfileFormValues>({
    resolver: zodResolver(taxProfileSchema),
    defaultValues: profile
      ? {
          vat_type: profile.vat_type ?? taxProfileDefaults.vat_type,
          business_type: profile.business_type ?? "",
          tax_year_start: profile.tax_year_start ? String(profile.tax_year_start) : "",
          accountant_name: profile.accountant_name ?? "",
          advance_rate: profile.advance_rate != null ? Number(profile.advance_rate) : null,
        }
      : taxProfileDefaults,
  });

  const vatTypeField = register("vat_type");
  const businessTypeField = register("business_type");
  const taxYearStartField = register("tax_year_start");

  const onSubmit = handleSubmit((values) => {
    onSave({
      vat_type: values.vat_type,
      business_type: values.business_type || null,
      tax_year_start: values.tax_year_start ? Number(values.tax_year_start) : null,
      accountant_name: values.accountant_name || null,
      advance_rate: values.advance_rate,
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {!isOsekMurshe && (
          <Select
            label="סוג דיווח"
            error={errors.vat_type?.message}
            disabled={isSaving}
            options={[
              { value: "monthly", label: getVatTypeLabel("monthly") },
              { value: "bimonthly", label: getVatTypeLabel("bimonthly") },
              { value: "exempt", label: getVatTypeLabel("exempt") },
            ]}
            {...vatTypeField}
          />
        )}
        <Select
          label="סוג עסק"
          error={errors.business_type?.message}
          disabled={isSaving}
          options={[
            { value: "", label: "בחר סוג עסק" },
            ...BUSINESS_TYPES.map((businessType) => ({
              value: businessType,
              label: BUSINESS_TYPE_LABELS[businessType],
            })),
          ]}
          {...businessTypeField}
        />
        <Select
          label="שנת מס ראשונה"
          error={errors.tax_year_start?.message}
          disabled={isSaving}
          options={[
            { value: "", label: "בחר שנה" },
            ...buildYearOptions(),
          ]}
          {...taxYearStartField}
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
