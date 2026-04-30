import { Modal } from '../../../components/ui/overlays/Modal'
import type { UseFormReturn } from 'react-hook-form'
import { TaxDeadlineCommonFields, TaxDeadlineModalFooter } from './TaxDeadlineFormParts'
import type { EditTaxDeadlineForm } from '../types'
import { EDIT_TAX_DEADLINE_FORM_ID } from '../constants'

interface EditTaxDeadlineFormProps {
  open: boolean
  onClose: () => void
  onSubmit: () => void
  form: UseFormReturn<EditTaxDeadlineForm>
  isSubmitting: boolean
}

export const EditTaxDeadlineFormModal = ({
  open,
  onClose,
  onSubmit,
  form,
  isSubmitting,
}: EditTaxDeadlineFormProps) => {
  const { reset } = form

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      title="עריכת מועד מס"
      onClose={handleClose}
      footer={
        <TaxDeadlineModalFooter
          isSubmitting={isSubmitting}
          submitLabel="עדכן מועד"
          onCancel={handleClose}
          onSubmit={onSubmit}
          submitForm={EDIT_TAX_DEADLINE_FORM_ID}
          submitType="submit"
        />
      }
    >
      <form id={EDIT_TAX_DEADLINE_FORM_ID} onSubmit={onSubmit} className="space-y-4">
        <TaxDeadlineCommonFields form={form} />
      </form>
    </Modal>
  )
}

EditTaxDeadlineFormModal.displayName = 'EditTaxDeadlineFormModal'
