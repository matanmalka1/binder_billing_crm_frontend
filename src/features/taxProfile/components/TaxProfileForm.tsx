import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../components/ui/primitives/Button";
import { Input } from "../../../components/ui/inputs/Input";
import { Select } from "../../../components/ui/inputs/Select";
import { getVatTypeLabel } from "../../../utils/enums";
import type { TaxProfileData } from "../hooks/useTaxProfile";
import type { TaxProfileUpdatePayload } from "../types";
import { taxProfileSchema, taxProfileDefaults, type TaxProfileFormValues } from "../schemas";

interface Props {
  profile: TaxProfileData | null;
  onSave: (data: TaxProfileUpdatePayload) => void;
  onCancel: () => void;
  isSaving: boolean;
  hideFooter?: boolean;
  formId?: string;
}

export const TaxProfileForm: React.FC<Props> = ({
  profile,
  onSave,
  onCancel,
  isSaving,
  hideFooter = false,
  formId,
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaxProfileFormValues>({
    resolver: zodResolver(taxProfileSchema),
    defaultValues: profile
      ? {
          vat_reporting_frequency: profile.vat_reporting_frequency ?? taxProfileDefaults.vat_reporting_frequency,
          accountant_name: profile.accountant_name ?? "",
          advance_rate: profile.advance_rate != null ? String(profile.advance_rate) : "",
        }
      : taxProfileDefaults,
  });
  const { field: vatReportingFrequencyField } = useController({
    name: "vat_reporting_frequency",
    control,
  });

  const onSubmit = handleSubmit((values) => {
    onSave({
      vat_reporting_frequency: values.vat_reporting_frequency,
      accountant_name: values.accountant_name || null,
      advance_rate: values.advance_rate || null,
    });
  });

  return (
    <form id={formId} onSubmit={onSubmit} className="space-y-4" noValidate>
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
          value={vatReportingFrequencyField.value ?? ""}
          onChange={vatReportingFrequencyField.onChange}
          onBlur={vatReportingFrequencyField.onBlur}
          name={vatReportingFrequencyField.name}
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
      {!hideFooter && (
        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="outline" disabled={isSaving} onClick={onCancel}>
            ביטול
          </Button>
          <Button type="submit" isLoading={isSaving}>
            שמור
          </Button>
        </div>
      )}
    </form>
  );
};
