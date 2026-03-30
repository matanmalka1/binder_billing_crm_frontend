import { useEffect } from "react";
import {
  ClientPickerField,
  createClientIdPickerHandlers,
  useClientPickerState,
} from "../../../components/shared/client";
import { Modal } from "../../../components/ui/overlays/Modal";
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
    setValue,
    formState: { errors },
    reset,
  } = form;
  const {
    clientQuery,
    selectedClient,
    handleSelectClient,
    handleClearClient,
    handleClientQueryChange,
    resetClientPicker,
  } = useClientPickerState(
    createClientIdPickerHandlers((value, options) =>
      setValue("business_id", value, options),
    ),
  );

  useEffect(() => {
    if (open) return;
    reset();
    resetClientPicker();
  }, [open, reset, resetClientPicker]);

  const handleClose = () => {
    reset();
    resetClientPicker();
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
        <input type="hidden" {...register("business_id", { required: "שדה חובה" })} />
        <ClientPickerField
          selectedClient={selectedClient}
          clientQuery={clientQuery}
          onQueryChange={handleClientQueryChange}
          onSelect={handleSelectClient}
          onClear={handleClearClient}
          error={errors.business_id?.message}
          label="עסק *"
        />
        <TaxDeadlineCommonFields form={form} />
      </div>
    </Modal>
  );
};

TaxDeadlineForm.displayName = "TaxDeadlineForm";
