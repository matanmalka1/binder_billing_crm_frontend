import { Controller } from "react-hook-form";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/Textarea";
import { DatePicker } from "../../../components/ui/DatePicker";
import { ClientSearchInput } from "../../../components/ui/ClientSearchInput";
import type { UseFormReturn } from "react-hook-form";
import type { ReceiveBinderFormValues } from "../schemas";
import type { BinderResponse } from "../types";
import { BINDER_TYPE_OPTIONS } from "../constants";
import { Alert } from "../../../components/ui/Alert";
import { isClientLockedForCreate } from "../../../utils/clientStatus";

interface BinderReceivePanelProps {
  form: UseFormReturn<ReceiveBinderFormValues>;
  clientQuery: string;
  selectedClient: { id: number; name: string; client_status?: string | null } | null;
  activeBinder?: BinderResponse | null;
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
  activeBinder,
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

  const clientLocked = isClientLockedForCreate(selectedClient?.client_status);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {activeBinder && (
        <div className="rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800" dir="rtl">
          נמצא קלסר פעיל #{activeBinder.binder_number} — החומר יתווסף אליו
        </div>
      )}

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

      <Input
        label="מספר קלסר"
        error={errors.binder_number?.message}
        placeholder="לדוגמה: 2024-003"
        {...register("binder_number")}
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
