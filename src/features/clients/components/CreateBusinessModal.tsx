import { useEffect } from "react";
import { useController, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../components/ui/overlays/Modal";
import { Input } from "../../../components/ui/inputs/Input";
import { ModalFormActions } from "../../../components/ui/overlays/ModalFormActions";
import { Select } from "../../../components/ui/inputs/Select";
import { Textarea } from "../../../components/ui/inputs/Textarea";
import { DatePicker } from "../../../components/ui/inputs/DatePicker";
import type { BusinessType, CreateBusinessPayload, ISODateString } from "../api";
import { createBusinessSchema, type CreateBusinessFormValues } from "../schemas";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBusinessPayload) => Promise<void>;
  isLoading?: boolean;
  clientNationalId: string;
  existingSoleTraderType?: BusinessType | null;
}

export const CreateBusinessModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  clientNationalId,
  existingSoleTraderType = null,
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateBusinessFormValues>({
    resolver: zodResolver(createBusinessSchema),
    defaultValues: {
      business_type: "osek_patur",
      opened_at: "",
      business_name: "",
      tax_id_number: "",
      notes: "",
    },
  });

  const { field: openedAtField } = useController({ name: "opened_at", control });
  const businessType = useWatch({ control, name: "business_type" });
  const taxIdValue = useWatch({ control, name: "tax_id_number" });

  useEffect(() => {
    setValue("tax_id_number", businessType === "company" ? "" : clientNationalId, {
      shouldValidate: false,
    });
  }, [businessType, clientNationalId, setValue]);

  const showHpHint = businessType === "company" && taxIdValue.length > 0 && !taxIdValue.startsWith("51");

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onClose();
    }
  };

  const onFormSubmit = handleSubmit(async (data) => {
    const payload: CreateBusinessPayload = {
      business_type: data.business_type,
      opened_at: data.opened_at as ISODateString,
      business_name: data.business_name || null,
      tax_id_number: data.tax_id_number || null,
      notes: data.notes || null,
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
        <div className="space-y-4">
          <Select
            label="סוג עסק *"
            error={errors.business_type?.message}
            disabled={isLoading}
            options={[
              {
                value: "osek_patur",
                label: "עוסק פטור",
                disabled: existingSoleTraderType === "osek_murshe",
              },
              {
                value: "osek_murshe",
                label: "עוסק מורשה",
                disabled: existingSoleTraderType === "osek_patur",
              },
              { value: "company", label: 'חברה בע"מ' },
              { value: "employee", label: "שכיר" },
            ]}
            {...register("business_type")}
          />
          <DatePicker
            label="תאריך פתיחה *"
            error={errors.opened_at?.message}
            disabled={isLoading}
            value={openedAtField.value}
            onChange={openedAtField.onChange}
            onBlur={openedAtField.onBlur}
            name={openedAtField.name}
          />
          <div>
            <Input
              label="מספר עוסק / ח.פ *"
              placeholder={businessType === "company" ? "הזן ח.פ" : ""}
              error={errors.tax_id_number?.message}
              disabled={isLoading}
              {...register("tax_id_number")}
            />
            {showHpHint && (
              <p className="mt-1 text-xs text-amber-600">מספרי ח.פ תקניים מתחילים ב-51</p>
            )}
          </div>
        </div>

        <div className="space-y-4 border-t border-gray-200 pt-4">
          <p className="text-sm font-medium text-gray-700">פרטים נוספים</p>
          <Input
            label="שם עסק *"
            placeholder="לדוגמה: מסעדת ישראל"
            error={errors.business_name?.message}
            disabled={isLoading}
            {...register("business_name")}
          />
          <Textarea
            label="הערות"
            placeholder="הערות חופשיות"
            error={errors.notes?.message}
            disabled={isLoading}
            {...register("notes")}
          />
        </div>

        <p className="text-xs text-gray-500">* שדות חובה</p>
      </form>
    </Modal>
  );
};
