import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ClientPickerField,
  createClientIdPickerHandlers,
  useClientPickerState,
} from '../../../components/shared/client'
import { Modal } from '../../../components/ui/overlays/Modal'
import type { UseFormReturn } from 'react-hook-form'
import { TaxDeadlineCommonFields, TaxDeadlineModalFooter } from './TaxDeadlineFormParts'
import type { CreateTaxDeadlineForm } from '../types'
import { clientsApi, clientsQK } from '@/features/clients'
import { REQUIRED_FIELD_MESSAGE, TAX_DEADLINE_CREATE_FORM_ID } from '../constants'

interface TaxDeadlineFormProps {
  open: boolean
  onClose: () => void
  onSubmit: () => void
  form: UseFormReturn<CreateTaxDeadlineForm>
  isSubmitting: boolean
}

export const TaxDeadlineForm = ({
  open,
  onClose,
  onSubmit,
  form,
  isSubmitting,
}: TaxDeadlineFormProps) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = form
  const {
    clientQuery,
    selectedClient,
    handleSelectClient,
    handleClearClient,
    handleClientQueryChange,
    resetClientPicker,
  } = useClientPickerState(
    createClientIdPickerHandlers((value, options) => setValue('client_id', value, options)),
  )
  const selectedClientId = watch('client_id')
  const clientIdNumber = Number(selectedClientId)
  const selectedClientQuery = useQuery({
    queryKey: clientsQK.detail(clientIdNumber),
    queryFn: () => clientsApi.getById(clientIdNumber),
    enabled: Number.isInteger(clientIdNumber) && clientIdNumber > 0,
  })

  useEffect(() => {
    if (open) return
    reset()
    resetClientPicker()
  }, [open, reset, resetClientPicker])

  const handleClose = () => {
    reset()
    resetClientPicker()
    onClose()
  }

  return (
    <Modal
      open={open}
      title="יצירת מועד מס חדש"
      onClose={handleClose}
      footer={
        <TaxDeadlineModalFooter
          isSubmitting={isSubmitting}
          submitLabel="צור מועד"
          onCancel={handleClose}
          onSubmit={onSubmit}
          submitForm={TAX_DEADLINE_CREATE_FORM_ID}
          submitType="submit"
        />
      }
    >
      <form id={TAX_DEADLINE_CREATE_FORM_ID} onSubmit={onSubmit} className="space-y-4">
        <input type="hidden" {...register('client_id', { required: REQUIRED_FIELD_MESSAGE })} />
        <ClientPickerField
          selectedClient={selectedClient}
          clientQuery={clientQuery}
          onQueryChange={handleClientQueryChange}
          onSelect={handleSelectClient}
          onClear={handleClearClient}
          error={errors.client_id?.message}
          label="לקוח *"
        />
        <TaxDeadlineCommonFields
          form={form}
          vatType={selectedClientQuery.data?.vat_reporting_frequency ?? null}
        />
      </form>
    </Modal>
  )
}

TaxDeadlineForm.displayName = 'TaxDeadlineForm'
