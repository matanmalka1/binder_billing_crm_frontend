import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { ClientSearchInput } from "../../../components/ui/ClientSearchInput";
import type { UseFormReturn } from "react-hook-form";
import type { ReceiveBinderFormValues } from "../schemas";
import { BINDER_TYPE_OPTIONS } from "../constants";

interface BinderReceivePanelProps {
  form: UseFormReturn<ReceiveBinderFormValues>;
  clientQuery: string;
  selectedClient: { id: number; name: string } | null;
  onClientSelect: (client: { id: number; name: string; id_number: string }) => void;
  onClientQueryChange: (query: string) => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

export const BinderReceivePanel: React.FC<BinderReceivePanelProps> = ({
  form,
  clientQuery,
  selectedClient,
  onClientSelect,
  onClientQueryChange,
  onSubmit,
  onClose,
  isSubmitting,
}) => {
  const {
    register,
    formState: { errors },
  } = form;

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

      <Input
        type="date"
        label="תאריך קבלה"
        error={errors.received_at?.message}
        {...register("received_at")}
      />

      <div className="w-full space-y-1">
        <label className="block text-sm font-medium text-gray-700">הערות</label>
        <textarea
          rows={3}
          placeholder="הערות פנימיות (אופציונלי)"
          className="w-full rounded-lg border border-gray-300 px-3 py-3 shadow-sm transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500 sm:text-sm bg-white resize-none"
          {...register("notes")}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          ביטול
        </Button>
        <Button type="button" variant="secondary" onClick={onSubmit} isLoading={isSubmitting}>
          קליטה
        </Button>
      </div>
    </form>
  );
};

BinderReceivePanel.displayName = "BinderReceivePanel";
