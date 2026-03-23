import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { FormField } from "../../../components/ui/FormField";
import { SelectDropdown } from "../../../components/ui/SelectDropdown";
import type { CreateChargePayload } from "../api";
import { CHARGE_TYPE_OPTIONS } from "../constants";
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
    control,
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
          <Controller
            control={control}
            name="charge_type"
            render={({ field }) => (
              <FormField label="סוג חיוב *" error={errors.charge_type?.message}>
                <SelectDropdown
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  options={CHARGE_TYPE_OPTIONS}
                  className={errors.charge_type ? "border-red-500" : undefined}
                />
              </FormField>
            )}
          />
          <Input
            label="תקופה (YYYY-MM)"
            placeholder="2026-02"
            error={errors.period?.message}
            {...register("period")}
          />
          <input type="hidden" {...register("currency")} />
        </div>

        {createError && <p className="text-sm text-red-600">{createError}</p>}
      </form>
    </Modal>
  );
};

ChargesCreateModal.displayName = "ChargesCreateModal";
