import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/Textarea";
import type { AuthorityContactResponse } from "../../../api/authorityContacts.api";
import { useAuthorityContactForm } from "../hooks/useAuthorityContactForm";

interface AuthorityContactModalProps {
  open: boolean;
  clientId: number;
  existing?: AuthorityContactResponse | null;
  onClose: () => void;
}

export const AuthorityContactModal: React.FC<AuthorityContactModalProps> = ({
  open,
  clientId,
  existing,
  onClose,
}) => {
  const { form, onSubmit, isSaving } = useAuthorityContactForm(clientId, onClose, existing);
  const { register, formState: { errors } } = form;

  return (
    <Modal
      open={open}
      title={existing ? "עריכת איש קשר" : "הוספת איש קשר"}
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" disabled={isSaving} onClick={onClose}>
            ביטול
          </Button>
          <Button type="button" isLoading={isSaving} onClick={onSubmit}>
            {existing ? "עדכן" : "הוסף"}
          </Button>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Select
          label="סוג גורם *"
          error={errors.contact_type?.message}
          {...register("contact_type")}
        >
          <option value="assessing_officer">פקיד שומה</option>
          <option value="vat_branch">סניף מע״מ</option>
          <option value="national_insurance">ביטוח לאומי</option>
          <option value="other">אחר</option>
        </Select>
        <Input label="שם *" error={errors.name?.message} {...register("name")} />
        <Input label="משרד / סניף" error={errors.office?.message} {...register("office")} />
        <Input label="טלפון" type="tel" error={errors.phone?.message} {...register("phone")} />
        <Input label="אימייל" type="email" error={errors.email?.message} {...register("email")} />
        <Textarea label="הערות" rows={3} error={errors.notes?.message} {...register("notes")} />
      </form>
    </Modal>
  );
};