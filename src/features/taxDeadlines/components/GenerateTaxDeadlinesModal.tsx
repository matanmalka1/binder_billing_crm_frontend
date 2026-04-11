import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  ClientPickerField,
  createClientIdPickerHandlers,
  useClientPickerState,
} from "../../../components/shared/client";
import { Input } from "../../../components/ui/inputs/Input";
import { Modal } from "../../../components/ui/overlays/Modal";
import { ModalFormActions } from "../../../components/ui/overlays/ModalFormActions";
import type { GenerateTaxDeadlinesForm } from "../types";

interface GenerateTaxDeadlinesModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: UseFormReturn<GenerateTaxDeadlinesForm>;
  isSubmitting: boolean;
}

export const GenerateTaxDeadlinesModal: React.FC<GenerateTaxDeadlinesModalProps> = ({
  open,
  onClose,
  onSubmit,
  form,
  isSubmitting,
}) => {
  const {
    register,
    reset,
    setValue,
    formState: { errors },
  } = form;
  const {
    clientQuery,
    selectedClient,
    handleSelectClient,
    handleClearClient,
    handleClientQueryChange,
    resetClientPicker,
  } = useClientPickerState(
    createClientIdPickerHandlers((value, options) => setValue("client_id", value, options)),
  );

  useEffect(() => {
    if (open) return;
    reset();
    resetClientPicker();
  }, [open, reset, resetClientPicker]);

  const handleClose = () => {
    if (isSubmitting) return;
    reset();
    resetClientPicker();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="יצירת מועדים אוטומטית"
      footer={(
        <ModalFormActions
          onCancel={handleClose}
          onSubmit={onSubmit}
          isLoading={isSubmitting}
          submitLabel="צור מועדים"
        />
      )}
    >
      <div className="space-y-4">
        <input type="hidden" {...register("client_id", { required: "שדה חובה" })} />
        <ClientPickerField
          selectedClient={selectedClient}
          clientQuery={clientQuery}
          onQueryChange={handleClientQueryChange}
          onSelect={handleSelectClient}
          onClear={handleClearClient}
          error={errors.client_id?.message}
          label="לקוח *"
        />

        <Input
          label="שנת מס *"
          type="number"
          min="2000"
          max="2100"
          {...register("year", {
            required: "שדה חובה",
            validate: (value) => /^\d{4}$/.test(value) || "יש להזין שנה בת 4 ספרות",
          })}
          error={errors.year?.message}
        />
      </div>
    </Modal>
  );
};

GenerateTaxDeadlinesModal.displayName = "GenerateTaxDeadlinesModal";
