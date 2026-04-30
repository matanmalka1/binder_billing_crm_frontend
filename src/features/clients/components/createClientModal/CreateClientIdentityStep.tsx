import { useWatch, type Control, type FieldErrors, type UseFormClearErrors, type UseFormRegister } from 'react-hook-form'
import { Input } from '../../../../components/ui/inputs/Input'
import { Select } from '../../../../components/ui/inputs/Select'
import { CREATE_CLIENT_ENTITY_OPTIONS } from '../../constants'
import type { CreateClientFormValues } from '../../schemas'
import { stripNonDigits } from './createClientFormUtils'
import { useIdNumberConflict } from './useIdNumberConflict'
import { CLIENT_ROUTES } from '../../api/endpoints'

interface Props {
  control: Control<CreateClientFormValues>
  disabled: boolean
  errors: FieldErrors<CreateClientFormValues>
  isCompany: boolean
  clearErrors: UseFormClearErrors<CreateClientFormValues>
  register: UseFormRegister<CreateClientFormValues>
}

export const CreateClientIdentityStep: React.FC<Props> = ({
  control,
  disabled,
  errors,
  isCompany,
  clearErrors,
  register,
}) => {
  const nameLabel = isCompany ? 'שם חברה' : 'שם מלא'
  const idNumberLabel = isCompany ? 'ח.פ' : 'ת.ז'
  const idNumberPlaceholder = isCompany ? '512345678' : '123456789'

  const entityTypeValue = useWatch({ control, name: 'entity_type' })
  const idNumber = useWatch({ control, name: 'id_number' })

  const entityTypeField = register('entity_type', {
    onChange: (event) => {
      if (event.target.value) clearErrors('entity_type')
    },
  })

  const { conflict } = useIdNumberConflict(idNumber ?? '', true)
  const activeConflicts = conflict?.active_clients ?? []

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">כל השדות בשלב זה חובה.</p>
      <Select
        label="סוג ישות *"
        error={errors.entity_type?.message}
        disabled={disabled}
        options={[{ value: '', label: 'בחר סוג ישות' }, ...CREATE_CLIENT_ENTITY_OPTIONS]}
        value={entityTypeValue ?? ''}
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
        onInput={stripNonDigits}
        {...register('id_number')}
      />
      {activeConflicts.length > 0 && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700" dir="rtl">
          <p className="font-medium mb-1">
            {isCompany ? 'ח.פ' : 'ת.ז'} זה כבר קיים במערכת — לא ניתן לפתוח לקוח כפול.
          </p>
          <ul className="space-y-1">
            {activeConflicts.map((c) => (
              <li key={c.id}>
                <a
                  href={CLIENT_ROUTES.detail(c.id)}
                  className="underline font-medium"
                  target="_blank"
                  rel="noreferrer"
                >
                  {c.full_name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
