import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/Textarea";
import { DatePicker } from "../../../components/ui/DatePicker";
import type { CreateBusinessPayload, ISODateString } from "../api";
import { createBusinessSchema, type CreateBusinessFormValues } from "../schemas";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBusinessPayload) => Promise<void>;
  isLoading?: boolean;
}

export const CreateBusinessModal: React.FC<Props> = ({ open, onClose, onSubmit, isLoading = false }) => {
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<CreateBusinessFormValues>({
    resolver: zodResolver(createBusinessSchema),
    defaultValues: { business_type: "osek_patur", opened_at: "", business_name: "", notes: "" },
  });

  const { field: openedAtField } = useController({ name: "opened_at", control });

  const handleClose = () => { if (!isLoading) { reset(); onClose(); } };

  const onFormSubmit = handleSubmit(async (data) => {
    const payload: CreateBusinessPayload = {
      business_type: data.business_type,
      opened_at: data.opened_at as ISODateString,
      business_name: data.business_name || null,
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
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>ביטול</Button>
          <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading} onClick={onFormSubmit}>הוסף עסק</Button>
        </div>
      }
    >
      <form onSubmit={onFormSubmit} className="space-y-4">
        <div className="space-y-4">
          <Select
            label="סוג עסק *"
            error={errors.business_type?.message}
            disabled={isLoading}
            options={[
              { value: "osek_patur", label: "עוסק פטור" },
              { value: "osek_murshe", label: "עוסק מורשה" },
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
        </div>

        <div className="space-y-4 border-t border-gray-200 pt-4">
          <p className="text-sm font-medium text-gray-700">פרטים נוספים (אופציונלי)</p>
          <Input label="שם עסק" placeholder="לדוגמה: מסעדת ישראל" error={errors.business_name?.message} disabled={isLoading} {...register("business_name")} />
          <Textarea label="הערות" placeholder="הערות חופשיות" error={errors.notes?.message} disabled={isLoading} {...register("notes")} />
        </div>

        <p className="text-xs text-gray-500">* שדות חובה</p>
      </form>
    </Modal>
  );
};
