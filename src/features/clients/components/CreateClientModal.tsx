import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import type { CreateClientPayload } from "../api";
import { createClientSchema, type CreateClientFormValues } from "../schemas";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClientPayload) => Promise<void>;
  isLoading?: boolean;
}

export const CreateClientModal: React.FC<Props> = ({ open, onClose, onSubmit, isLoading = false }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateClientFormValues>({
    resolver: zodResolver(createClientSchema),
    defaultValues: { full_name: "", id_number: "", id_number_type: "individual", phone: "", email: "" },
  });

  const handleClose = () => { if (!isLoading) { reset(); onClose(); } };
  const onFormSubmit = handleSubmit(async (data) => {
    const payload: CreateClientPayload = {
      ...data,
      phone: data.phone ? data.phone : null,
      email: data.email ? data.email : null,
      address_street: null,
      address_building_number: null,
      address_apartment: null,
      address_city: null,
      address_zip_code: null,
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
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>ביטול</Button>
          <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading} onClick={onFormSubmit}>יצור לקוח</Button>
        </div>
      }
    >
      <form onSubmit={onFormSubmit} className="space-y-4">
        <div className="space-y-4">
          <Input label="שם מלא *" placeholder="ישראל ישראלי" error={errors.full_name?.message} disabled={isLoading} {...register("full_name")} />
          <Input label="מספר זהות / ח.פ *" placeholder="123456789" error={errors.id_number?.message} disabled={isLoading} {...register("id_number")} />
          <Select label="סוג מזהה *" error={errors.id_number_type?.message} disabled={isLoading} {...register("id_number_type")}>
            <option value="individual">יחיד</option>
            <option value="corporation">תאגיד</option>
            <option value="passport">דרכון</option>
            <option value="other">אחר</option>
          </Select>
        </div>

        <div className="space-y-4 border-t border-gray-200 pt-4">
          <p className="text-sm font-medium text-gray-700">פרטי התקשרות (אופציונלי)</p>
          <Input label="טלפון" type="tel" placeholder="050-1234567" error={errors.phone?.message} disabled={isLoading} {...register("phone")} />
          <Input label="אימייל" type="email" placeholder="הזן כתובת אימייל" error={errors.email?.message} disabled={isLoading} {...register("email")} />
        </div>

        <p className="text-xs text-gray-500">* שדות חובה</p>
      </form>
    </Modal>
  );
};
