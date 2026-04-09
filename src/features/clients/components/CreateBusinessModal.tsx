import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../components/ui/overlays/Modal";
import { Input } from "../../../components/ui/inputs/Input";
import { ModalFormActions } from "../../../components/ui/overlays/ModalFormActions";
import { DatePicker } from "../../../components/ui/inputs/DatePicker";
import type { CreateBusinessPayload, EntityType, ISODateString } from "../api";
import { createBusinessSchema, type CreateBusinessFormValues } from "../schemas";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBusinessPayload) => Promise<void>;
  isLoading?: boolean;
  clientEntityType?: EntityType | null;
}

/** Maps client entity_type to the business_type sent to the backend. */
function entityTypeToBusinessType(entityType: EntityType | null | undefined): CreateBusinessPayload["business_type"] {
  switch (entityType) {
    case "osek_patur":   return "osek_patur";
    case "osek_murshe":  return "osek_murshe";
    case "company_ltd":  return "company";
    case "employee":     return "employee";
    default:             return "osek_patur";
  }
}

export const CreateBusinessModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  clientEntityType,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CreateBusinessFormValues>({
    resolver: zodResolver(createBusinessSchema),
    defaultValues: {
      opened_at: "",
      business_name: "",
    },
  });

  const { field: openedAtField } = useController({ name: "opened_at", control });

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onClose();
    }
  };

  const onFormSubmit = handleSubmit(async (data) => {
    const payload: CreateBusinessPayload = {
      business_type: entityTypeToBusinessType(clientEntityType),
      opened_at: data.opened_at as ISODateString,
      business_name: data.business_name || null,
    };
    await onSubmit(payload);
    reset();
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="הוספת עסק"
      footer={
        <ModalFormActions
          onCancel={handleClose}
          onSubmit={onFormSubmit}
          isLoading={isLoading}
          submitLabel="הוסף עסק"
        />
      }
    >
      <form onSubmit={onFormSubmit} className="space-y-4">
        <DatePicker
          label="תאריך פתיחה *"
          error={errors.opened_at?.message}
          disabled={isLoading}
          value={openedAtField.value}
          onChange={openedAtField.onChange}
          onBlur={openedAtField.onBlur}
          name={openedAtField.name}
        />
        <Input
          label="שם עסק *"
          placeholder="לדוגמה: מסעדת ישראל"
          error={errors.business_name?.message}
          disabled={isLoading}
          {...register("business_name")}
        />
        <p className="text-xs text-gray-500">* שדות חובה</p>
      </form>
    </Modal>
  );
};
