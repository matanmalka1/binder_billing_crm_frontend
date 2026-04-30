import { Modal } from '../../../components/ui/overlays/Modal'
import { Button } from '../../../components/ui/primitives/Button'
import { type AuthorityContactResponse } from '../api'
import { AUTHORITY_CONTACT_TEXT } from '../constants'
import { useAuthorityContactForm } from '../hooks/useAuthorityContactForm'
import { AuthorityContactFormFields } from './AuthorityContactFormFields'

interface AuthorityContactModalProps {
  open: boolean
  clientId: number
  existing?: AuthorityContactResponse | null
  onClose: () => void
}

export const AuthorityContactModal: React.FC<AuthorityContactModalProps> = ({
  open,
  clientId,
  existing,
  onClose,
}) => {
  const { form, onSubmit, isSaving } = useAuthorityContactForm(clientId, onClose, existing)

  return (
    <Modal
      open={open}
      title={existing ? AUTHORITY_CONTACT_TEXT.editTitle : AUTHORITY_CONTACT_TEXT.createTitle}
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" disabled={isSaving} onClick={onClose}>
            {AUTHORITY_CONTACT_TEXT.cancel}
          </Button>
          <Button type="button" isLoading={isSaving} onClick={onSubmit}>
            {existing ? AUTHORITY_CONTACT_TEXT.editSubmit : AUTHORITY_CONTACT_TEXT.createSubmit}
          </Button>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthorityContactFormFields form={form} />
      </form>
    </Modal>
  )
}
