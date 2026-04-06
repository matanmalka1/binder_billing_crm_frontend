import { Modal } from "../../../components/ui/overlays/Modal";
import { type AuthorityContactResponse } from "../api";
import { useAuthorityContactForm } from "../hooks/useAuthorityContactForm";
import { AuthorityContactFormFields } from "./AuthorityContactFormFields";
import { AuthorityContactModalFooter } from "./AuthorityContactModalFooter";

interface AuthorityContactModalProps {
  open: boolean;
  businessId: number;
  existing?: AuthorityContactResponse | null;
  onClose: () => void;
}

export const AuthorityContactModal: React.FC<AuthorityContactModalProps> = ({
  open,
  businessId,
  existing,
  onClose,
}) => {
  const { form, onSubmit, isSaving } = useAuthorityContactForm(businessId, onClose, existing);

  return (
    <Modal
      open={open}
      title={existing ? "עריכת איש קשר" : "הוספת איש קשר"}
      onClose={onClose}
      footer={
        <AuthorityContactModalFooter
          isEditing={Boolean(existing)}
          isSaving={isSaving}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthorityContactFormFields form={form} />
      </form>
    </Modal>
  );
};
