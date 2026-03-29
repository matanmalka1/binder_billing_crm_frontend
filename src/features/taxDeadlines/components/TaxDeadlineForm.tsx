import { Input } from "../../../components/ui/Input";
import { Modal } from "../../../components/ui/Modal";
import type { UseFormReturn } from "react-hook-form";
import {
  TaxDeadlineCommonFields,
  TaxDeadlineModalFooter,
} from "./TaxDeadlineFormParts";
import type { CreateTaxDeadlineForm } from "../types";

interface TaxDeadlineFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: UseFormReturn<CreateTaxDeadlineForm>;
  isSubmitting: boolean;
}

export const TaxDeadlineForm = ({
  open,
  onClose,
  onSubmit,
  form,
  isSubmitting,
}: TaxDeadlineFormProps) => {
  const {
    register,
    formState: { errors },
    reset,
  } = form;

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      title="יצירת מועד מס חדש"
      onClose={handleClose}
      footer={<TaxDeadlineModalFooter isSubmitting={isSubmitting} submitLabel="צור מועד" onCancel={handleClose} onSubmit={onSubmit} />}
    >
      <div className="space-y-4">
        <Input
          label="מזהה לקוח *"
          type="number"
          placeholder="לדוגמה: 123"
          {...register("client_id", { required: "שדה חובה" })}
          error={errors.client_id?.message}
        />
        <TaxDeadlineCommonFields form={form} />
      </div>
    </Modal>
  );
};

TaxDeadlineForm.displayName = "TaxDeadlineForm";
