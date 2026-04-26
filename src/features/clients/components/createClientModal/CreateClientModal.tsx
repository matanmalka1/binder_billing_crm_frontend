import { useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../../components/ui/overlays/Modal";
import { useAdvisorOptions } from "@/features/users";
import type { CreateClientPayload } from "../../api";
import { useClientCreationImpact } from "../../hooks/useClientCreationImpact";
import { CREATE_CLIENT_DEFAULT_VALUES } from "../../constants";
import { createClientSchema, type CreateClientFormValues } from "../../schemas";
import { CreateClientModalFooter } from "./CreateClientModalFooter";
import { CreateClientStepContent } from "./CreateClientStepContent";
import { CreateClientStepIndicator } from "./CreateClientStepIndicator";
import { buildCreateClientPayload } from "./createClientFormUtils";
import { CREATE_CLIENT_STEPS } from "./createClientSteps";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClientPayload) => Promise<void>;
  isLoading?: boolean;
}

export const CreateClientModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
    reset,
  } = useForm<CreateClientFormValues>({
    resolver: zodResolver(createClientSchema),
    mode: "onBlur",
    defaultValues: CREATE_CLIENT_DEFAULT_VALUES,
  });
  const { field: businessOpenedAtField } = useController({ name: "business_opened_at", control });

  const currentEntityType = watch("entity_type");
  const currentVatFrequency = watch("vat_reporting_frequency");
  const { options: advisorOptions, isLoading: advisorsLoading } = useAdvisorOptions();
  const isCompany = currentEntityType === "company_ltd";
  const isExempt = currentEntityType === "osek_patur";
  const showVatFrequency = currentEntityType != null && !isExempt;

  const impactQuery = useClientCreationImpact(
    currentEntityType && (isExempt || currentVatFrequency)
      ? { entity_type: currentEntityType, vat_reporting_frequency: currentVatFrequency }
      : null,
  );
  const currentStep = CREATE_CLIENT_STEPS[stepIndex];
  const isLastStep = stepIndex === CREATE_CLIENT_STEPS.length - 1;

  useEffect(() => {
    if (isExempt) {
      setValue("vat_reporting_frequency", null, { shouldValidate: false });
    } else if (currentVatFrequency == null) {
      setValue("vat_reporting_frequency", "monthly", { shouldValidate: false });
    }
  }, [isExempt, setValue]);

  useEffect(() => {
    if (!open) {
      reset();
      setStepIndex(0);
    }
  }, [open]);

  const handleClose = () => {
    if (!isLoading) {
      reset();
      setStepIndex(0);
      onClose();
    }
  };

  const goToNextStep = async () => {
    const isValid = await trigger([...currentStep.fields], { shouldFocus: true });
    if (isValid) setStepIndex((current) => Math.min(current + 1, CREATE_CLIENT_STEPS.length - 1));
  };

  const goToPreviousStep = () => {
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const onFormSubmit = handleSubmit(async (data) => {
    try {
      await onSubmit(buildCreateClientPayload(data));
    } catch {
      return;
    }
    reset();
    setStepIndex(0);
    onClose();
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="יצירת לקוח חדש"
      footer={
        <CreateClientModalFooter
          isLastStep={isLastStep}
          isLoading={isLoading}
          onClose={handleClose}
          onPrevious={goToPreviousStep}
          onSubmit={onFormSubmit}
          onNext={goToNextStep}
          stepIndex={stepIndex}
        />
      }
    >
      <form onSubmit={onFormSubmit} className="space-y-4">
        <CreateClientStepIndicator stepIndex={stepIndex} />
        <CreateClientStepContent
          advisorOptions={advisorOptions}
          advisorsLoading={advisorsLoading}
          businessOpenedAtField={businessOpenedAtField}
          disabled={isLoading}
          errors={errors}
          impactData={impactQuery.data}
          impactLoading={impactQuery.isLoading}
          isCompany={isCompany}
          isExempt={isExempt}
          register={register}
          showVatFrequency={showVatFrequency}
          stepIndex={stepIndex}
        />
      </form>
    </Modal>
  );
};
