import { Modal } from "../../../components/ui/overlays/Modal";
import { Button } from "../../../components/ui/primitives/Button";
import { type AuthorityContactResponse } from "../api";
import { useAuthorityContactForm } from "../hooks/useAuthorityContactForm";
import { AuthorityContactFormFields } from "./AuthorityContactFormFields";

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
        <AuthorityContactFormFields form={form} />
      </form>
    </Modal>
  );
};
