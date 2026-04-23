import { Controller, type UseFormReturn } from "react-hook-form";
import { Select } from "@/components/ui/inputs/Select";
import { buildYearOptions, MONTH_OPTIONS } from "@/utils/utils";
import type { ReceiveBinderFormValues } from "../../schemas";

const PERIODIC_BINDER_TYPES = new Set(["vat", "salary"]);

interface BinderPeriodFieldsProps {
  form: UseFormReturn<ReceiveBinderFormValues>;
  materialType: string;
  vatType: "monthly" | "bimonthly" | "exempt" | null;
}

const YEAR_OPTIONS = buildYearOptions().map((option) => ({
  ...option,
  disabled: false as const,
}));

export const BinderPeriodFields: React.FC<BinderPeriodFieldsProps> = ({
  form,
  materialType,
  vatType,
}) => {
  const {
    control,
    formState: { errors },
  } = form;

  const periodicMode = PERIODIC_BINDER_TYPES.has(materialType);
  const bimonthlyVatMode = materialType === "vat" && vatType === "bimonthly";
  const monthOptions = (bimonthlyVatMode
    ? MONTH_OPTIONS.filter((option) => [1, 3, 5, 7, 9, 11].includes(Number(option.value)))
    : MONTH_OPTIONS
  ).map((option) => ({ ...option, disabled: false as const }));

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Controller
        name="period_year"
        control={control}
        render={({ field }) => (
          <Select
            label="שנת דיווח"
            error={errors.period_year?.message}
            options={[
              { value: "", label: "בחר שנה...", disabled: true },
              ...YEAR_OPTIONS,
            ]}
            value={field.value ? String(field.value) : ""}
            onChange={(event) => field.onChange(event.target.value ? Number(event.target.value) : undefined)}
            onBlur={field.onBlur}
            name={field.name}
          />
        )}
      />

      {periodicMode && (
        <Controller
          name="period_month_start"
          control={control}
          render={({ field }) => (
            <Select
              label={bimonthlyVatMode ? "חודש התחלה" : "חודש דיווח"}
              error={errors.period_month_start?.message}
              options={[
                { value: "", label: "בחר חודש...", disabled: true },
                ...monthOptions,
              ]}
              value={field.value ? String(field.value) : ""}
              onChange={(event) => field.onChange(event.target.value ? Number(event.target.value) : null)}
              onBlur={field.onBlur}
              name={field.name}
            />
          )}
        />
      )}

      {bimonthlyVatMode && (
        <Controller
          name="period_month_end"
          control={control}
          render={({ field }) => (
            <Select
              label="חודש סיום"
              error={errors.period_month_end?.message}
              options={[
                { value: "", label: "ייבחר אוטומטית", disabled: true },
                ...MONTH_OPTIONS.map((option) => ({ ...option, disabled: false as const })),
              ]}
              value={field.value ? String(field.value) : ""}
              onChange={() => undefined}
              onBlur={field.onBlur}
              name={field.name}
              disabled
            />
          )}
        />
      )}
    </div>
  );
};

BinderPeriodFields.displayName = "BinderPeriodFields";
