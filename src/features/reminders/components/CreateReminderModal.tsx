import { useEffect } from 'react'
import { Controller } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import {
  ClientPickerField,
  createClientIdPickerHandlers,
  useClientPickerState,
} from '../../../components/shared/client'
import { Modal } from '../../../components/ui/overlays/Modal'
import { Button } from '../../../components/ui/primitives/Button'
import { Input } from '../../../components/ui/inputs/Input'
import { DatePicker } from '../../../components/ui/inputs/DatePicker'
import { Select } from '../../../components/ui/inputs/Select'
import type { CreateReminderFormValues } from '../types'
import type { BinderResponse } from '@/features/binders'
import type { BusinessResponse } from '@/features/clients'
import { reminderTypeOptions } from '../types'
import { ReminderLinkedFields } from './ReminderLinkedFields'

interface CreateReminderModalProps {
  open: boolean
  form: UseFormReturn<CreateReminderFormValues>
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (e?: React.BaseSyntheticEvent) => void
  fixedClientId?: number
  fixedClientName?: string
  clientBinders?: BinderResponse[]
  clientBusinesses?: BusinessResponse[]
}

// react-hook-form types errors on discriminated unions narrowly; cast once here.
type FormErrors = Partial<Record<keyof CreateReminderFormValues, { message?: string }>>

export const CreateReminderModal: React.FC<CreateReminderModalProps> = ({
  open,
  form,
  isSubmitting,
  onClose,
  onSubmit,
  fixedClientId,
  fixedClientName,
  clientBinders = [],
  clientBusinesses = [],
}) => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = form
  const e = errors as FormErrors
  const {
    clientQuery,
    selectedClient,
    handleSelectClient,
    handleClearClient,
    handleClientQueryChange,
    resetClientPicker,
  } = useClientPickerState(
    createClientIdPickerHandlers((value, options) => setValue('client_record_id', value, options)),
  )

  const clientDisplay = fixedClientId
    ? fixedClientName
      ? `${fixedClientName} (#${fixedClientId})`
      : `#${fixedClientId}`
    : null

  useEffect(() => {
    if (open || fixedClientId) return
    resetClientPicker()
  }, [fixedClientId, open, resetClientPicker])

  const handleClose = () => {
    if (!fixedClientId) {
      resetClientPicker()
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      title="תזכורת חדשה"
      onClose={handleClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            ביטול
          </Button>
          <Button type="button" variant="primary" onClick={onSubmit} isLoading={isSubmitting}>
            יצירה
          </Button>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <input type="hidden" {...register('client_record_id', { required: 'שדה חובה' })} />
        <input type="hidden" {...register('business_id')} />
        {clientDisplay ? (
          <div>
            <p className="mb-1 text-sm font-medium text-gray-700">לקוח</p>
            <p className="text-sm text-gray-900">{clientDisplay}</p>
          </div>
        ) : (
          <ClientPickerField
            selectedClient={selectedClient}
            clientQuery={clientQuery}
            onQueryChange={handleClientQueryChange}
            onSelect={handleSelectClient}
            onClear={handleClearClient}
            error={e.client_record_id?.message}
            label="לקוח *"
          />
        )}

        <Select label="סוג תזכורת" error={e.reminder_type?.message} {...register('reminder_type')}>
          {reminderTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <ReminderLinkedFields
          form={form}
          clientBinders={clientBinders}
          clientBusinesses={clientBusinesses}
        />

        <Controller
          name="target_date"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="תאריך יעד"
              error={e.target_date?.message}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />

        <Input
          type="number"
          label="ימים לפני"
          min={0}
          error={e.days_before?.message}
          {...register('days_before', { valueAsNumber: true })}
        />
      </form>
    </Modal>
  )
}

CreateReminderModal.displayName = 'CreateReminderModal'
