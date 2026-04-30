import type { UseFormReturn } from 'react-hook-form'
import { Input } from '../../../components/ui/inputs/Input'
import { Select } from '../../../components/ui/inputs/Select'
import { Textarea } from '../../../components/ui/inputs/Textarea'
import type { BinderResponse } from '@/features/binders'
import type { ChargeResponse } from '@/features/charges'
import { getChargeStatusLabel } from '../../../utils/enums'
import { getChargeTypeLabel } from '@/features/charges'
import type { TaxDeadlineResponse } from '@/features/taxDeadlines'
import { getDeadlineTypeLabel } from '@/features/taxDeadlines'
import type { AnnualReportFull } from '@/features/annualReports'
import type { AdvancePaymentRow } from '@/features/advancedPayments'
import type { BusinessResponse } from '@/features/clients'
import { MESSAGE_REMINDER_TYPES } from '../constants'
import type { CreateReminderFormValues } from '../types'

type FormErrors = Partial<Record<keyof CreateReminderFormValues, { message?: string }>>

interface ReminderLinkedFieldsProps {
  form: UseFormReturn<CreateReminderFormValues>
  clientBinders: BinderResponse[]
  clientCharges: ChargeResponse[]
  clientTaxDeadlines: TaxDeadlineResponse[]
  clientAnnualReports: AnnualReportFull[]
  clientAdvancePayments: AdvancePaymentRow[]
  clientBusinesses: BusinessResponse[]
}

export const ReminderLinkedFields: React.FC<ReminderLinkedFieldsProps> = ({
  form,
  clientBinders,
  clientCharges,
  clientTaxDeadlines,
  clientAnnualReports,
  clientAdvancePayments,
  clientBusinesses,
}) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form
  const reminderType = watch('reminder_type')
  const e = errors as FormErrors

  return (
    <>
      {(reminderType === 'tax_deadline_approaching' || reminderType === 'vat_filing') &&
        (clientTaxDeadlines.length > 0 ? (
          <Select
            label="מועד מס"
            error={e.tax_deadline_id?.message}
            {...register('tax_deadline_id')}
          >
            <option value="">בחר מועד מס...</option>
            {clientTaxDeadlines.map((deadline) => (
              <option key={deadline.id} value={String(deadline.id)}>
                {getDeadlineTypeLabel(deadline.deadline_type)} - {deadline.due_date}
              </option>
            ))}
          </Select>
        ) : (
          <Input
            type="number"
            min={1}
            label="מזהה מועד מס"
            error={e.tax_deadline_id?.message}
            {...register('tax_deadline_id')}
          />
        ))}

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

      {reminderType === 'unpaid_charge' &&
        (clientCharges.length > 0 ? (
          <Select
            label="חשבונית"
            error={e.charge_id?.message}
            {...register('charge_id', {
              onChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
                const charge = clientCharges.find((item) => String(item.id) === event.target.value)
                setValue('business_id', charge?.business_id ? String(charge.business_id) : '')
              },
            })}
          >
            <option value="">בחר חשבונית...</option>
            {clientCharges.map((charge) => (
              <option key={charge.id} value={String(charge.id)}>
                #{charge.id} - {getChargeTypeLabel(charge.charge_type)} (
                {getChargeStatusLabel(charge.status)})
              </option>
            ))}
          </Select>
        ) : (
          <Input
            type="number"
            min={1}
            label="מזהה חשבונית"
            error={e.charge_id?.message}
            {...register('charge_id')}
          />
        ))}

      {reminderType === 'annual_report_deadline' &&
        (clientAnnualReports.length > 0 ? (
          <Select
            label="דוח שנתי"
            error={e.annual_report_id?.message}
            {...register('annual_report_id')}
          >
            <option value="">בחר דוח שנתי...</option>
            {clientAnnualReports.map((report) => (
              <option key={report.id} value={String(report.id)}>
                {report.tax_year} - {report.status}
              </option>
            ))}
          </Select>
        ) : (
          <Input
            type="number"
            min={1}
            label="מזהה דוח שנתי"
            error={e.annual_report_id?.message}
            {...register('annual_report_id')}
          />
        ))}

      {reminderType === 'advance_payment_due' &&
        (clientAdvancePayments.length > 0 ? (
          <Select
            label="מקדמה"
            error={e.advance_payment_id?.message}
            {...register('advance_payment_id')}
          >
            <option value="">בחר מקדמה...</option>
            {clientAdvancePayments.map((payment) => (
              <option key={payment.id} value={String(payment.id)}>
                {payment.period} - {payment.status}
              </option>
            ))}
          </Select>
        ) : (
          <Input
            type="number"
            min={1}
            label="מזהה מקדמה"
            error={e.advance_payment_id?.message}
            {...register('advance_payment_id')}
          />
        ))}

      {(reminderType === 'advance_payment_due' || reminderType === 'document_missing') &&
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
