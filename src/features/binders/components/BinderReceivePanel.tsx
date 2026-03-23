import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Alert } from "../../../components/ui/Alert";
import { Button } from "../../../components/ui/Button";
import { ClientSearchInput } from "@/components/shared/client";
import { DatePicker } from "../../../components/ui/DatePicker";
import { Select } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/Textarea";
import { isClientLockedForCreate } from "../../../utils/clientStatus";
import { BINDER_TYPE_OPTIONS } from "../constants";
import type { ReceiveBinderFormValues } from "../schemas";
import type { BinderResponse } from "../types";
import { BinderNumberField } from "./BinderNumberField";
import { VatPeriodField } from "./VatPeriodField";

interface BinderReceivePanelProps {
  form: UseFormReturn<ReceiveBinderFormValues>;
  clientQuery: string;
  selectedClient: { id: number; name: string; client_status?: string | null } | null;
  clientBinders: BinderResponse[];
  allBinders: BinderResponse[];
  vatType: "monthly" | "bimonthly" | "exempt" | null;
  onClientSelect: (client: { id: number; name: string; id_number: string; client_status?: string | null }) => void;
  onClientQueryChange: (query: string) => void;
  onBinderSelect: (binderNumber: string, clientId: number, clientName: string, clientStatus: string | null) => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

export const BinderReceivePanel: React.FC<BinderReceivePanelProps> = ({
  form,
  clientQuery,
  selectedClient,
  clientBinders,
  allBinders,
  vatType,
  onClientSelect,
  onClientQueryChange,
  onBinderSelect,
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

      {binderType === "vat" && (vatType === "monthly" || vatType === "bimonthly") && (
        <Controller
          name="vat_period"
          control={control}
          render={({ field }) => (
            <VatPeriodField
              vatType={vatType}
              value={field.value ?? ""}
              onChange={field.onChange}
              error={errors.vat_period?.message}
            />
          )}
        />
      )}

      <BinderNumberField
        form={form}
        selectedClient={selectedClient}
        clientBinders={clientBinders}
        allBinders={allBinders}
        onBinderSelect={onBinderSelect}
      />

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
