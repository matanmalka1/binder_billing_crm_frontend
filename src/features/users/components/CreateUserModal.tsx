import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { UserFormFields } from "../hooks/UserFormFields";
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
    defaultValues: { full_name: "", email: "", phone: "", role: "secretary", password: "" },
  });

  const handleClose = () => { reset(); onClose(); };

  const onFormSubmit = handleSubmit(async (data) => {
    await onSubmit({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || null,
      role: data.role,
      password: data.password,
    });
    reset();
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="יצירת משתמש חדש"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>ביטול</Button>
          <Button variant="primary" onClick={onFormSubmit} isLoading={isLoading}>צור משתמש</Button>
        </div>
      }
    >
      <form onSubmit={onFormSubmit}>
        <UserFormFields register={register} errors={errors} showPassword />
      </form>
    </Modal>
  );
};

CreateUserModal.displayName = "CreateUserModal";