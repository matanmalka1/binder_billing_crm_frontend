import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Input } from '../../../../components/ui/inputs/Input'
import { Select } from '../../../../components/ui/inputs/Select'
import { CREATE_CLIENT_VAT_OPTIONS, DEFAULT_VAT_EXEMPT_CEILING } from '../../constants'
import type { CreateClientFormValues } from '../../schemas'
import { stripNonDecimal } from './createClientFormUtils'

interface ImpactData {
  items: Array<{ label: string; count: number }>
  note?: string | null
  years_scope: number
}

interface Props {
  advisorOptions: Array<{ value: string; label: string }>
  advisorsLoading: boolean
  disabled: boolean
  errors: FieldErrors<CreateClientFormValues>
  impactData?: ImpactData
  impactLoading: boolean
  isExempt: boolean
  register: UseFormRegister<CreateClientFormValues>
  showVatFrequency: boolean
}

export const CreateClientTaxStep: React.FC<Props> = ({
  advisorOptions,
  advisorsLoading,
  disabled,
  errors,
  impactData,
  impactLoading,
  isExempt,
  register,
  showVatFrequency,
}) => (
  <div className="space-y-4">
    <p className="text-xs text-gray-500">בדוק את הגדרות המס לפני יצירת הלקוח.</p>
    {showVatFrequency && (
      <Select
        label="תדירות דיווח מע״מ *"
        error={errors.vat_reporting_frequency?.message}
        disabled={disabled}
        options={[{ value: '', label: 'בחר תדירות דיווח' }, ...CREATE_CLIENT_VAT_OPTIONS]}
        {...register('vat_reporting_frequency')}
      />
    )}
    <div className="grid grid-cols-2 gap-4">
      {isExempt && (
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">תקרת פטור מע״מ</p>
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
            ₪{DEFAULT_VAT_EXEMPT_CEILING}
          </div>
          <p className="mt-1 text-xs text-gray-400">נגזר אוטומטית לפי הגדרת המערכת</p>
        </div>
      )}
      <Input
        label="אחוז מקדמה (%)"
        placeholder="לדוגמה: 8.5"
        error={errors.advance_rate?.message}
        disabled={disabled}
        onInput={stripNonDecimal}
        {...register('advance_rate')}
      />
    </div>
    <Select
      label="רואה חשבון מלווה *"
      error={errors.accountant_id?.message}
      disabled={disabled || advisorsLoading}
      options={[
        { value: '', label: advisorsLoading ? 'טוען רואי חשבון...' : 'בחר רואה חשבון' },
        ...advisorOptions,
      ]}
      {...register('accountant_id')}
    />
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4" dir="rtl">
      <p className="mb-2 text-sm font-semibold text-blue-800">מה ייווצר לאחר שמירה?</p>
      {impactLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-blue-100" />
          ))}
        </div>
      ) : impactData ? (
        <>
          <ul className="space-y-1">
            {impactData.items.map((item) => (
              <li key={item.label} className="flex justify-between text-sm text-blue-700">
                <span>{item.label}</span>
                <span className="font-medium">{item.count}</span>
              </li>
            ))}
          </ul>
          {impactData.note && <p className="mt-2 text-xs text-blue-600">{impactData.note}</p>}
          {impactData.years_scope === 2 && (
            <p className="mt-1 text-xs text-blue-600">ייווצר עבור השנה הנוכחית והשנה הבאה</p>
          )}
        </>
      ) : (
        <p className="text-sm text-blue-700">ייתכן שייווצרו קלסר ומועדים בהתאם לסוג הלקוח</p>
      )}
    </div>
  </div>
)
