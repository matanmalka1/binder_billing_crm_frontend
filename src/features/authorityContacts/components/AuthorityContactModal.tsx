import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import type { AuthorityContactResponse } from "../../../api/authorityContacts.api";
import { useAuthorityContactForm } from "../hooks/useAuthorityContactForm";

interface Props {
  open: boolean;
  clientId: number;
  existing?: AuthorityContactResponse | null;
  onClose: () => void;
}

export const AuthorityContactModal: React.FC<Props> = ({ open, clientId, existing, onClose }) => {
  const { form, onSubmit, isSaving } = useAuthorityContactForm(
    clientId,
    onClose,
    existing,
  );
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
        <Select label="סוג גורם *" error={errors.contact_type?.message} {...register("contact_type")}>
          <option value="assessing_officer">פקיד שומה</option>
          <option value="vat_branch">סניף מע״מ</option>
          <option value="national_insurance">ביטוח לאומי</option>
          <option value="other">אחר</option>
        </Select>
        <Input label="שם *" error={errors.name?.message} {...register("name")} />
        <Input label="משרד / סניף" error={errors.office?.message} {...register("office")} />
        <Input label="טלפון" type="tel" error={errors.phone?.message} {...register("phone")} />
        <Input label="אימייל" type="email" error={errors.email?.message} {...register("email")} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">הערות</label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            {...register("notes")}
          />
        </div>
      </form>
    </Modal>
  );
};
