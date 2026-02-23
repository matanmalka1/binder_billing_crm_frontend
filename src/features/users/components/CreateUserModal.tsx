import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import { createUserSchema, type CreateUserFormValues } from "../schemas";
import type { CreateUserPayload } from "../../../api/users.api";

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateUserPayload) => Promise<void>;
  isLoading?: boolean;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      role: "secretary",
      password: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = handleSubmit(async (data) => {
    const payload: CreateUserPayload = {
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || null,
      role: data.role,
      password: data.password,
    };
    await onSubmit(payload);
    reset();
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="יצירת משתמש חדש"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            ביטול
          </Button>
          <Button
            variant="primary"
            onClick={onFormSubmit}
            isLoading={isLoading}
          >
            צור משתמש
          </Button>
        </div>
      }
    >
      <form onSubmit={onFormSubmit} className="space-y-4">
        <Input
          label="שם מלא *"
          {...register("full_name")}
          error={errors.full_name?.message}
          placeholder="ישראל ישראלי"
        />
        <Input
          label="אימייל *"
          type="email"
          {...register("email")}
          error={errors.email?.message}
          placeholder="user@example.com"
        />
        <Input
          label="טלפון"
          {...register("phone")}
          error={errors.phone?.message}
          placeholder="050-0000000"
        />
        <Select
          label="תפקיד *"
          {...register("role")}
          error={errors.role?.message}
        >
          <option value="secretary">מזכירה</option>
          <option value="advisor">יועץ</option>
        </Select>
        <Input
          label="סיסמה *"
          type="password"
          {...register("password")}
          error={errors.password?.message}
          placeholder="לפחות 8 תווים"
        />
      </form>
    </Modal>
  );
};
