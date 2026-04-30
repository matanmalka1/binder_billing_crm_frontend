import type { FieldErrors, UseFormClearErrors, UseFormRegister } from 'react-hook-form'
import { Input } from '../../../../components/ui/inputs/Input'
import { Select } from '../../../../components/ui/inputs/Select'
import { CREATE_CLIENT_ENTITY_OPTIONS } from '../../constants'
import type { CreateClientFormValues } from '../../schemas'
import { stripNonDigits } from './createClientFormUtils'

interface Props {
  disabled: boolean
  errors: FieldErrors<CreateClientFormValues>
  isCompany: boolean
  clearErrors: UseFormClearErrors<CreateClientFormValues>
  register: UseFormRegister<CreateClientFormValues>
}

export const CreateClientIdentityStep: React.FC<Props> = ({
  disabled,
  errors,
  isCompany,
  clearErrors,
  register,
}) => {
  const nameLabel = isCompany ? 'שם חברה' : 'שם מלא'
  const idNumberLabel = isCompany ? 'ח.פ' : 'ת.ז'
  const idNumberPlaceholder = isCompany ? '512345678' : '123456789'
  const entityTypeField = register('entity_type', {
    onChange: (event) => {
      if (event.target.value) clearErrors('entity_type')
    },
  })

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">כל השדות בשלב זה חובה.</p>
      <Select
        label="סוג ישות *"
        error={errors.entity_type?.message}
        disabled={disabled}
        options={[{ value: '', label: 'בחר סוג ישות' }, ...CREATE_CLIENT_ENTITY_OPTIONS]}
        {...entityTypeField}
      />
      <Input
        label={`${nameLabel} *`}
        error={errors.full_name?.message}
        disabled={disabled}
        {...register('full_name')}
      />
      <Input
        label={`${idNumberLabel} *`}
        placeholder={idNumberPlaceholder}
        error={errors.id_number?.message}
        disabled={disabled}
        onInput={isCompany ? stripNonDigits : undefined}
        {...register('id_number')}
      />
    </div>
  )
}
