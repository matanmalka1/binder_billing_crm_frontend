import type { UseFormReturn } from 'react-hook-form'
import { Input } from '../../../components/ui/inputs/Input'
import { Select } from '../../../components/ui/inputs/Select'
import { Textarea } from '../../../components/ui/inputs/Textarea'
import type { BinderResponse } from '@/features/binders'
import type { BusinessResponse } from '@/features/clients'
import { MESSAGE_REMINDER_TYPES } from '../constants'
import type { CreateReminderFormValues } from '../types'

type FormErrors = Partial<Record<keyof CreateReminderFormValues, { message?: string }>>

interface ReminderLinkedFieldsProps {
  form: UseFormReturn<CreateReminderFormValues>
  clientBinders: BinderResponse[]
  clientBusinesses: BusinessResponse[]
}

export const ReminderLinkedFields: React.FC<ReminderLinkedFieldsProps> = ({
  form,
  clientBinders,
  clientBusinesses,
}) => {
  const {
    register,
    watch,
    formState: { errors },
  } = form
  const reminderType = watch('reminder_type')
  const e = errors as FormErrors

  return (
    <>
      {reminderType === 'binder_idle' &&
        (clientBinders.length > 0 ? (
          <Select label="תיק" error={e.binder_id?.message} {...register('binder_id')}>
            <option value="">בחר תיק...</option>
            {clientBinders.map((binder) => (
              <option key={binder.id} value={String(binder.id)}>
                {binder.binder_number}
              </option>
            ))}
          </Select>
        ) : (
          <Input
            type="number"
            min={1}
            label="מזהה תיק"
            error={e.binder_id?.message}
            {...register('binder_id')}
          />
        ))}

      {reminderType === 'document_missing' &&
        (clientBusinesses.length > 0 ? (
          <Select label="עסק *" error={e.business_id?.message} {...register('business_id')}>
            <option value="">בחר עסק...</option>
            {clientBusinesses.map((business) => (
              <option key={business.id} value={String(business.id)}>
                {business.business_name ?? `עסק #${business.id}`}
              </option>
            ))}
          </Select>
        ) : (
          <Input
            type="number"
            min={1}
            label="מזהה עסק *"
            error={e.business_id?.message}
            {...register('business_id')}
          />
        ))}

      {reminderType === 'custom' && (
        <Input
          label="שם תזכורת מותאמת *"
          placeholder="לדוג': תזכורת לחידוש רישיון"
          error={e.message?.message}
          {...register('message')}
        />
      )}

      {(reminderType === 'document_missing' || MESSAGE_REMINDER_TYPES.includes(reminderType)) && (
        <Textarea
          label="הודעה"
          rows={3}
          placeholder="אופציונלי - אם ריק תופק הודעת ברירת מחדל"
          error={e.message?.message}
          {...register('message')}
        />
      )}
    </>
  )
}

ReminderLinkedFields.displayName = 'ReminderLinkedFields'
