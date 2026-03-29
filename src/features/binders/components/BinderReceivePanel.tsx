import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Alert } from "../../../components/ui/overlays/Alert";
import { Button } from "../../../components/ui/primitives/Button";
import { ClientSearchInput } from "@/components/shared/client";
import { DatePicker } from "../../../components/ui/inputs/DatePicker";
import { Select } from "../../../components/ui/inputs/Select";
import { Textarea } from "../../../components/ui/inputs/Textarea";
import { isClientLockedForCreate } from "../../../utils/clientStatus";
import { BINDER_TYPE_OPTIONS } from "../constants";
import type { ReceiveBinderFormValues } from "../schemas";
import { ReportingPeriodField } from "./ReportingPeriodField";

interface BinderReceivePanelProps {
  form: UseFormReturn<ReceiveBinderFormValues>;
  clientQuery: string;
  selectedClient: { id: number; name: string; client_status?: string | null } | null;
  businesses: { id: number; business_name: string | null; business_type: string }[];
  hasActiveBinder: boolean;
  vatType: "monthly" | "bimonthly" | "exempt" | null;
  onClientSelect: (client: { id: number; name: string; id_number: string; client_status?: string | null }) => void;
  onClientQueryChange: (query: string) => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

export const BinderReceivePanel: React.FC<BinderReceivePanelProps> = ({
  form,
  clientQuery,
  selectedClient,
  businesses,
  hasActiveBinder,
  vatType,
  onClientSelect,
  onClientQueryChange,
  onSubmit,
  onClose,
  isSubmitting,
}) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;
  const binderType = form.watch("binder_type");

  const clientLocked = isClientLockedForCreate(selectedClient?.client_status);

  const businessOptions = [
    { value: "", label: "בחר עסק...", disabled: businesses.length > 0 ? true : false },
    ...businesses.map((b) => ({ value: String(b.id), label: b.business_name ?? `עסק #${b.id}` })),
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <ClientSearchInput
        value={clientQuery}
        onChange={onClientQueryChange}
        onSelect={onClientSelect}
        error={
          errors.client_id?.message ??
          (!selectedClient && clientQuery.length > 0 ? "נא לבחור לקוח מהרשימה" : undefined)
        }
      />

      {selectedClient && (
        <p className="text-xs text-green-700 font-medium -mt-2">
          ✓ נבחר: {selectedClient.name} (#{selectedClient.id})
        </p>
      )}

      {selectedClient && clientLocked && (
        <Alert
          variant={selectedClient.client_status === "closed" ? "error" : "warning"}
          message={
            selectedClient.client_status === "closed"
              ? "לקוח סגור – לא ניתן לקלוט קלסר"
              : "לקוח מוקפא – לא ניתן לקלוט קלסר חדש"
          }
        />
      )}

      <Select
        label="סוג חומר"
        error={errors.binder_type?.message}
        options={[...BINDER_TYPE_OPTIONS]}
        {...register("binder_type")}
      />

      {selectedClient && (
        <Controller
          name="business_id"
          control={control}
          render={({ field }) => (
            <Select
              label="עסק"
              error={errors.business_id?.message}
              disabled={businesses.length === 0}
              options={businessOptions}
              value={field.value !== undefined ? String(field.value) : ""}
              onChange={(e) => {
                const v = e.target.value;
                field.onChange(v === "" ? undefined : Number(v));
              }}
              onBlur={field.onBlur}
              name={field.name}
            />
          )}
        />
      )}

      {selectedClient && binderType && (
        <Controller
          name="reporting_period"
          control={control}
          render={({ field }) => (
            <ReportingPeriodField
              materialType={binderType}
              vatType={vatType}
              value={field.value ?? ""}
              onChange={field.onChange}
              error={errors.reporting_period?.message}
            />
          )}
        />
      )}

      <Controller
        name="received_at"
        control={control}
        render={({ field }) => (
          <DatePicker
            label="תאריך קבלה"
            error={errors.received_at?.message}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />

      {selectedClient && hasActiveBinder && (
        <label className="flex items-center gap-2 text-sm text-amber-700 cursor-pointer" dir="rtl">
          <input type="checkbox" {...register("open_new_binder")} className="rounded" />
          קלסר מלא – פתח קלסר חדש
        </label>
      )}

      <Textarea
        label="הערות"
        rows={3}
        placeholder="הערות פנימיות (אופציונלי)"
        {...register("notes")}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          ביטול
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting || clientLocked}>
          קליטה
        </Button>
      </div>
    </form>
  );
};

BinderReceivePanel.displayName = "BinderReceivePanel";
