import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../components/ui/overlays/Modal";
import { Input } from "../../../components/ui/inputs/Input";
import { ModalFormActions } from "../../../components/ui/overlays/ModalFormActions";
import { Select } from "../../../components/ui/inputs/Select";
import type { CreateClientPayload } from "../api";
import {
  CLIENT_ID_NUMBER_INPUT_LABELS,
  CLIENT_ID_NUMBER_PLACEHOLDERS,
  CLIENT_ID_NUMBER_TYPE_LABELS,
  VAT_TYPE_LABELS,
} from "../constants";
import { createClientSchema, type CreateClientFormValues } from "../schemas";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClientPayload) => Promise<void>;
  isLoading?: boolean;
}

const stripNonDigits = (e: React.FormEvent<HTMLInputElement>) => {
  const input = e.currentTarget;
  const cleaned = input.value.replace(/\D/g, "");
  if (cleaned !== input.value) input.value = cleaned;
};

const stripNonPhone = (e: React.FormEvent<HTMLInputElement>) => {
  const input = e.currentTarget;
  const cleaned = input.value.replace(/[^\d-]/g, "");
  if (cleaned !== input.value) input.value = cleaned;
};

export const CreateClientModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<CreateClientFormValues>({
    resolver: zodResolver(createClientSchema),
    mode: "onBlur",
    defaultValues: {
      id_number_type: "individual",
      full_name: "",
      id_number: "",
      phone: "",
      email: "",
      address_street: "",
      address_building_number: "",
      address_city: "",
      vat_reporting_frequency: null,
    },
  });

  const idNumberType = watch("id_number_type");
  const idNumberLabel = CLIENT_ID_NUMBER_INPUT_LABELS[idNumberType] ?? "מספר מזהה";
  const idNumberPlaceholder = CLIENT_ID_NUMBER_PLACEHOLDERS[idNumberType] ?? "הזן מספר מזהה";
  const shouldStripToDigits = idNumberType === "individual" || idNumberType === "corporation";

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onClose();
    }
  };

  const onFormSubmit = handleSubmit(async (data) => {
    const payload: CreateClientPayload = {
      full_name: data.full_name,
      id_number: data.id_number,
      id_number_type: data.id_number_type,
      phone: data.phone,
      email: data.email,
      address_street: data.address_street || null,
      address_building_number: data.address_building_number || null,
      address_city: data.address_city || null,
      address_apartment: null,
      address_zip_code: null,
      vat_reporting_frequency: data.vat_reporting_frequency || null,
    };
    await onSubmit(payload);
    reset();
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="יצירת לקוח חדש"
      footer={
        <ModalFormActions
          onCancel={handleClose}
          onSubmit={onFormSubmit}
          isLoading={isLoading}
          submitLabel="יצור לקוח"
        />
      }
    >
      <form onSubmit={onFormSubmit} className="space-y-4">
        <Select
          label="סוג מזהה *"
          error={errors.id_number_type?.message}
          disabled={isLoading}
          {...register("id_number_type")}
        >
          <option value="individual">{CLIENT_ID_NUMBER_TYPE_LABELS.individual}</option>
          <option value="corporation">{CLIENT_ID_NUMBER_TYPE_LABELS.corporation}</option>
          <option value="passport">{CLIENT_ID_NUMBER_TYPE_LABELS.passport}</option>
          <option value="other">{CLIENT_ID_NUMBER_TYPE_LABELS.other}</option>
        </Select>

        <Input
          label="שם מלא *"
          error={errors.full_name?.message}
          disabled={isLoading}
          {...register("full_name")}
        />

        <Input
          label={`${idNumberLabel} *`}
          placeholder={idNumberPlaceholder}
          error={errors.id_number?.message}
          disabled={isLoading}
          onInput={shouldStripToDigits ? stripNonDigits : undefined}
          {...register("id_number")}
        />

        <div className="border-t border-gray-200 pt-4 space-y-4">
          <p className="text-sm font-medium text-gray-700">פרטי התקשרות</p>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="טלפון *"
              type="tel"
              placeholder="050-1234567"
              error={errors.phone?.message}
              disabled={isLoading}
              onInput={stripNonPhone}
              {...register("phone")}
            />
            <Input
              label="אימייל *"
              type="email"
              placeholder="name@example.com"
              error={errors.email?.message}
              disabled={isLoading}
              {...register("email")}
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-4">
          <p className="text-sm font-medium text-gray-700">כתובת</p>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="רחוב"
              placeholder="שם הרחוב"
              error={errors.address_street?.message}
              disabled={isLoading}
              {...register("address_street")}
            />
            <Input
              label="מספר בניין"
              placeholder="מספר"
              error={errors.address_building_number?.message}
              disabled={isLoading}
              {...register("address_building_number")}
            />
          </div>
          <Input
            label="עיר"
            placeholder="שם העיר"
            error={errors.address_city?.message}
            disabled={isLoading}
            {...register("address_city")}
          />
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-4">
          <p className="text-sm font-medium text-gray-700">הגדרות מע״מ</p>
          <Select
            label="תדירות דיווח מע״מ"
            disabled={isLoading}
            options={[
              { value: "", label: "לא הוגדר" },
              { value: "monthly", label: VAT_TYPE_LABELS.monthly },
              { value: "bimonthly", label: VAT_TYPE_LABELS.bimonthly },
              { value: "exempt", label: VAT_TYPE_LABELS.exempt },
            ]}
            {...register("vat_reporting_frequency")}
          />
        </div>

        <p className="text-xs text-gray-500">* שדות חובה</p>
      </form>
    </Modal>
  );
};
