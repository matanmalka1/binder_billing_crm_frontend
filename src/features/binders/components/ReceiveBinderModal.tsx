import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { ClientSearchInput } from "./ClientSearchInput";
import type { UseFormReturn } from "react-hook-form";
import type { ReceiveBinderFormValues } from "../types";
import { BINDER_TYPE_OPTIONS } from "../types";

interface ReceiveBinderModalProps {
  open: boolean;
  form: UseFormReturn<ReceiveBinderFormValues>;
  clientQuery: string;
  selectedClient: { id: number; name: string } | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  onClientSelect: (client: { id: number; name: string; id_number: string }) => void;
  onClientQueryChange: (query: string) => void;
}

export const ReceiveBinderModal: React.FC<ReceiveBinderModalProps> = ({
  open,
  form,
  clientQuery,
  selectedClient,
  isSubmitting,
  onClose,
  onSubmit,
  onClientSelect,
  onClientQueryChange,
}) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Modal
      open={open}
      title="קליטת חומר מלקוח"
      onClose={onClose}
      footer={
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            ביטול
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onSubmit}
            isLoading={isSubmitting}
          >
            קליטה
          </Button>
        </div>
      }
    >
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
          {...register("binder_type", { required: "נא לבחור סוג חומר" })}
        />

        <Input
          label="מספר קלסר"
          error={errors.binder_number?.message}
          placeholder="לדוגמה: 2024-003"
          {...register("binder_number", { required: "נא להזין מספר קלסר" })}
        />

        <Input
          type="date"
          label="תאריך קבלה"
          error={errors.received_at?.message}
          {...register("received_at", { required: "נא לבחור תאריך קבלה" })}
        />
      </form>
    </Modal>
  );
};