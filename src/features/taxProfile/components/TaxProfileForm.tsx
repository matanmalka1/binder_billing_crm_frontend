import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../components/ui/primitives/Button";
import { Input } from "../../../components/ui/inputs/Input";
import { Select } from "../../../components/ui/inputs/Select";
import { useAdvisorOptions } from "@/features/users";
import { taxProfileSchema, type TaxProfileFormValues } from "../schemas";
import { ADVANCE_RATE_INPUT, TAX_PROFILE_FIELD_LABELS, TAX_PROFILE_TEXT } from "../constants";
import {
  getAdvisorSelectOptions,
  getTaxProfileFormValues,
  toTaxProfileUpdatePayload,
  VAT_REPORTING_FREQUENCY_OPTIONS,
} from "../helpers";
import type { TaxProfileFormProps } from "../types";

export const TaxProfileForm: React.FC<TaxProfileFormProps> = ({
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
    defaultValues: getTaxProfileFormValues(profile),
  });
  const { field: vatReportingFrequencyField } = useController({
    name: "vat_reporting_frequency",
    control,
  });
  const { options: advisorOptions, isLoading: advisorsLoading } = useAdvisorOptions();

  const onSubmit = handleSubmit((values) => {
    onSave(toTaxProfileUpdatePayload(values));
  });

  return (
    <form id={formId} onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Select
          label={TAX_PROFILE_FIELD_LABELS.vatReportingFrequency}
          error={errors.vat_reporting_frequency?.message}
          disabled={isSaving}
          options={VAT_REPORTING_FREQUENCY_OPTIONS}
          value={vatReportingFrequencyField.value ?? ""}
          onChange={vatReportingFrequencyField.onChange}
          onBlur={vatReportingFrequencyField.onBlur}
          name={vatReportingFrequencyField.name}
        />
        <Select
          label={TAX_PROFILE_FIELD_LABELS.accountant}
          error={errors.accountant_id?.message}
          disabled={isSaving || advisorsLoading}
          options={getAdvisorSelectOptions(advisorOptions, advisorsLoading)}
          {...register("accountant_id")}
        />
        <Input
          label={TAX_PROFILE_FIELD_LABELS.advanceRateInput}
          type="number"
          min={ADVANCE_RATE_INPUT.min}
          max={ADVANCE_RATE_INPUT.max}
          step={ADVANCE_RATE_INPUT.step}
          error={errors.advance_rate?.message}
          {...register("advance_rate")}
        />
      </div>
      {!hideFooter && (
        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="outline" disabled={isSaving} onClick={onCancel}>
            {TAX_PROFILE_TEXT.cancel}
          </Button>
          <Button type="submit" isLoading={isSaving}>
            {TAX_PROFILE_TEXT.save}
          </Button>
        </div>
      )}
    </form>
  );
};
