import { useController, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '../../../../components/ui/overlays/Modal'
import { DatePicker } from '../../../../components/ui/inputs/DatePicker'
import { Input } from '../../../../components/ui/inputs/Input'
import { ModalFormActions } from '../../../../components/ui/overlays/ModalFormActions'
import type { CreateBusinessPayload, ISODateString } from '../../api'
import { createBusinessSchema, type CreateBusinessFormValues } from '../../schemas'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateBusinessPayload) => Promise<void>
  isLoading?: boolean
}

export const CreateBusinessModal: React.FC<Props> = ({ open, onClose, onSubmit, isLoading = false }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateBusinessFormValues>({
    resolver: zodResolver(createBusinessSchema),
    defaultValues: {
      business_name: '',
      opened_at: null,
    },
  })
  const { field: openedAtField } = useController({ name: 'opened_at', control })

  const handleClose = () => {
    if (!isLoading) {
      reset()
      onClose()
    }
  }

  const onFormSubmit = handleSubmit(async (data) => {
    const payload: CreateBusinessPayload = {
      business_name: data.business_name,
      opened_at: data.opened_at ? (data.opened_at as ISODateString) : null,
    }
    await onSubmit(payload)
    reset()
  })

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="הוספת עסק"
      footer={
        <ModalFormActions onCancel={handleClose} onSubmit={onFormSubmit} isLoading={isLoading} submitLabel="הוסף עסק" />
      }
    >
      <form onSubmit={onFormSubmit} className="space-y-4">
        <Input
          label="שם עסק *"
          placeholder="לדוגמה: מסעדת ישראל"
          error={errors.business_name?.message}
          disabled={isLoading}
          {...register('business_name')}
        />
        <DatePicker
          label="תאריך פתיחת עסק"
          error={errors.opened_at?.message}
          disabled={isLoading}
          value={openedAtField.value ?? ''}
          onChange={openedAtField.onChange}
          onBlur={openedAtField.onBlur}
          name={openedAtField.name}
        />
        <p className="text-xs text-gray-500">* שדות חובה</p>
      </form>
    </Modal>
  )
}
