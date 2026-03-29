import { Modal } from "../../../components/ui/Modal";
import type { UseFormReturn } from "react-hook-form";
import {
  TaxDeadlineCommonFields,
  TaxDeadlineModalFooter,
} from "./TaxDeadlineFormParts";
import type { EditTaxDeadlineForm } from "../types";

interface EditTaxDeadlineFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: UseFormReturn<EditTaxDeadlineForm>;
  isSubmitting: boolean;
}

export const EditTaxDeadlineFormModal = ({
  open,
  onClose,
  onSubmit,
  form,
  isSubmitting,
}: EditTaxDeadlineFormProps) => {
  const { reset } = form;

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      title="עריכת מועד מס"
      onClose={handleClose}
      footer={<TaxDeadlineModalFooter isSubmitting={isSubmitting} submitLabel="עדכן מועד" onCancel={handleClose} onSubmit={onSubmit} />}
    >
      <div className="space-y-4">
        <TaxDeadlineCommonFields form={form} />
      </div>
    </Modal>
  );
};

EditTaxDeadlineFormModal.displayName = "EditTaxDeadlineFormModal";
