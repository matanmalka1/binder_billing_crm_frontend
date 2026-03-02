import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import type { CreateChargePayload } from "../../../api/charges.api";
import {
  chargeCreateDefaultValues,
  chargeCreateSchema,
  toCreateChargePayload,
  type ChargeCreateFormValues,
} from "../schemas";

interface ChargesCreateModalProps {
  open: boolean;
  createError: string | null;
  createLoading: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateChargePayload) => Promise<boolean>;
}

const CHARGE_TYPE_OPTIONS = [
  { value: "one_time", label: "חד פעמי" },
  { value: "retainer", label: "ריטיינר" },
];

export const ChargesCreateModal: React.FC<ChargesCreateModalProps> = ({
  open,
  createError,
  createLoading,
  onClose,
  onSubmit,
}) => {
  const {
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset,
  } = useForm<ChargeCreateFormValues>({
    defaultValues: chargeCreateDefaultValues,
    resolver: zodResolver(chargeCreateSchema),
  });

  const handleClose = () => {
    reset(chargeCreateDefaultValues);
    onClose();
  };

  const submitForm = handleSubmit(async (values) => {
    const created = await onSubmit(toCreateChargePayload(values));
    if (created) {
      reset(chargeCreateDefaultValues);
      onClose();
    }
  });

  return (
    <Modal
      open={open}
      title="יצירת חיוב חדש"
      isDirty={isDirty}
      onClose={handleClose}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={createLoading}>
            ביטול
          </Button>
          <Button type="button" isLoading={createLoading} onClick={() => void submitForm()}>
            יצירת חיוב
          </Button>
        </div>
      }
    >
      <form id="charges-create-form" onSubmit={submitForm} className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="מזהה לקוח *"
            type="number"
            min={1}
            placeholder="123"
            error={errors.client_id?.message}
            {...register("client_id")}
          />
          <Input
            label="סכום *"
            type="number"
            min={0.01}
            step="0.01"
            placeholder="0.00"
            error={errors.amount?.message}
            {...register("amount")}
          />
          <Select
            label="סוג חיוב *"
            error={errors.charge_type?.message}
            options={CHARGE_TYPE_OPTIONS}
            {...register("charge_type")}
          />
          <Input
            label="תקופה (YYYY-MM)"
            placeholder="2026-02"
            error={errors.period?.message}
            {...register("period")}
          />
          <Input
            label="מטבע *"
            placeholder="ILS"
            error={errors.currency?.message}
            {...register("currency")}
          />
        </div>

        {createError && <p className="text-sm text-red-600">{createError}</p>}
      </form>
    </Modal>
  );
};

ChargesCreateModal.displayName = "ChargesCreateModal";
