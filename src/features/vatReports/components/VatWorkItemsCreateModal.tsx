import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import type { CreateVatWorkItemPayload } from "../../../api/vatReports.api";
import {
  vatWorkItemCreateDefaultValues,
  vatWorkItemCreateSchema,
  toCreateVatWorkItemPayload,
  type VatWorkItemCreateFormValues,
} from "../schemas";

interface VatWorkItemsCreateModalProps {
  open: boolean;
  createError: string | null;
  createLoading: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateVatWorkItemPayload) => Promise<boolean>;
}

export const VatWorkItemsCreateModal: React.FC<VatWorkItemsCreateModalProps> = ({
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
    watch,
  } = useForm<VatWorkItemCreateFormValues>({
    defaultValues: vatWorkItemCreateDefaultValues,
    resolver: zodResolver(vatWorkItemCreateSchema),
  });

  const markPending = watch("mark_pending");

  const handleClose = () => {
    reset(vatWorkItemCreateDefaultValues);
    onClose();
  };

  const submitForm = handleSubmit(async (values) => {
    const created = await onSubmit(toCreateVatWorkItemPayload(values));
    if (created) {
      reset(vatWorkItemCreateDefaultValues);
      onClose();
    }
  });

  return (
    <Modal
      open={open}
      title='פתיחת תיק מע"מ חדש'
      isDirty={isDirty}
      onClose={handleClose}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={createLoading}>
            ביטול
          </Button>
          <Button type="button" isLoading={createLoading} onClick={() => void submitForm()}>
            פתיחת תיק
          </Button>
        </div>
      }
    >
      <form onSubmit={submitForm} className="space-y-4">
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
            label="תקופה (YYYY-MM) *"
            placeholder="2026-02"
            error={errors.period?.message}
            {...register("period")}
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
            {...register("mark_pending")}
          />
          <span className="text-sm font-medium text-gray-700">ממתין לחומרים</span>
        </label>

        {markPending && (
          <Input
            label="הערה לחומרים חסרים"
            placeholder="פרט אילו מסמכים חסרים..."
            error={errors.pending_materials_note?.message}
            {...register("pending_materials_note")}
          />
        )}

        {createError && <p className="text-sm text-red-600">{createError}</p>}
      </form>
    </Modal>
  );
};

VatWorkItemsCreateModal.displayName = "VatWorkItemsCreateModal";
