import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import type { TaxProfileData } from "../hooks/useTaxProfile";
import { taxProfileSchema, type TaxProfileFormValues } from "./taxProfileSchema";

interface Props {
  profile: TaxProfileData | null;
  onSave: (data: Partial<TaxProfileData>) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export const TaxProfileForm: React.FC<Props> = ({ profile, onSave, onCancel, isSaving }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<TaxProfileFormValues>({
    resolver: zodResolver(taxProfileSchema),
    defaultValues: {
      vat_type: profile?.vat_type ?? "monthly",
      business_type: profile?.business_type ?? "",
      tax_year_start: profile?.tax_year_start ? String(profile.tax_year_start) : "",
      accountant_name: profile?.accountant_name ?? "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    onSave({
      vat_type: values.vat_type,
      business_type: values.business_type || null,
      tax_year_start: values.tax_year_start ? Number(values.tax_year_start) : null,
      accountant_name: values.accountant_name || null,
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Select label="סוג מע״מ" error={errors.vat_type?.message} {...register("vat_type")}>
          <option value="monthly">חודשי</option>
          <option value="bimonthly">דו-חודשי</option>
          <option value="exempt">פטור</option>
        </Select>
        <Input label="תחום עיסוק" error={errors.business_type?.message} {...register("business_type")} />
        <Input label="שנת מס ראשונה" type="number" min={1900} max={2100} error={errors.tax_year_start?.message} {...register("tax_year_start")} />
        <Input label="רואה חשבון מלווה" error={errors.accountant_name?.message} {...register("accountant_name")} />
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" disabled={isSaving} onClick={onCancel}>ביטול</Button>
        <Button type="submit" isLoading={isSaving}>שמור</Button>
      </div>
    </form>
  );
};
