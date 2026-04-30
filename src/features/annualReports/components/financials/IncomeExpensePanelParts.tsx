import { useState, type ReactNode } from 'react'
import { Button } from '../../../../components/ui/primitives/Button'
import { cn, formatCurrencyILS as fmt } from '../../../../utils/utils'
import {
  FinancialAddFormShell,
  FinancialAmountDescriptionFields,
  FinancialSelectField,
} from './FinancialLineFormParts'
import { FIELD_PLACEHOLDERS } from './financialConstants'
import { useIncomeLineForm } from './useFinancialLineForm'

export interface AddLineFormProps {
  typeOptions: Record<string, string>
  onAdd: (typeKey: string, amount: string, description?: string) => void
  isAdding: boolean
  label: string
}

export const AddLineForm: React.FC<AddLineFormProps> = ({
  typeOptions,
  onAdd,
  isAdding,
  label,
}) => {
  const [open, setOpen] = useState(false)
  const form = useIncomeLineForm(undefined, (payload) => {
    onAdd(payload.source_type, payload.amount, payload.description)
    form.reset()
    setOpen(false)
  })

  const close = () => {
    form.reset()
    setOpen(false)
  }

  return (
    <FinancialAddFormShell
      open={open}
      label={label}
      error={form.error}
      isSubmitting={isAdding}
      onOpen={() => setOpen(true)}
      onSubmit={form.submit}
      onCancel={close}
    >
      <FinancialSelectField
        value={form.typeKey}
        onChange={form.setTypeKey}
        options={typeOptions}
        placeholder={FIELD_PLACEHOLDERS.incomeType}
      />
      <FinancialAmountDescriptionFields
        amount={form.amount}
        onAmountChange={form.setAmount}
        description={form.description}
        onDescriptionChange={form.setDescription}
      />
    </FinancialAddFormShell>
  )
}

interface AutoPopulateControlsProps {
  showForceConfirm: boolean
  isPending: boolean
  onPopulate: (force: boolean) => void
  onCancelForce: () => void
}

export const AutoPopulateControls: React.FC<AutoPopulateControlsProps> = ({
  showForceConfirm,
  isPending,
  onPopulate,
  onCancelForce,
}) => (
  <div className="flex justify-end gap-2">
    {showForceConfirm ? (
      <>
        <span className="self-center text-sm text-warning-700">
          קיימות שורות — למחוק ולמלא מחדש?
        </span>
        <Button type="button" variant="outline" size="sm" onClick={onCancelForce}>
          ביטול
        </Button>
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={() => onPopulate(true)}
          isLoading={isPending}
        >
          מחק ומלא מחדש
        </Button>
      </>
    ) : (
      <Button
        type="button"
        variant="primary"
        size="sm"
        onClick={() => onPopulate(false)}
        isLoading={isPending}
        className="bg-info-600 hover:bg-info-700"
      >
        מלא מנתוני מע"מ
      </Button>
    )}
  </div>
)

interface FinancialSummaryCardsProps {
  totalIncome: number
  totalExpenses: number
  taxableIncome: number
}

export const FinancialSummaryCards: React.FC<FinancialSummaryCardsProps> = ({
  totalIncome,
  totalExpenses,
  taxableIncome,
}) => (
  <div className="grid grid-cols-3 gap-3">
    <div className="rounded-xl border border-positive-100 bg-positive-50 p-4 text-center">
      <p className="text-xs text-gray-500 mb-1">סה"כ הכנסות</p>
      <p className="text-lg font-bold text-positive-700">{fmt(totalIncome)}</p>
    </div>
    <div className="rounded-xl border border-negative-100 bg-negative-50 p-4 text-center">
      <p className="text-xs text-gray-500 mb-1">סה"כ הוצאות</p>
      <p className="text-lg font-bold text-negative-600">{fmt(totalExpenses)}</p>
    </div>
    <div
      className={cn(
        'rounded-xl border p-4 text-center',
        taxableIncome >= 0 ? 'border-info-100 bg-info-50' : 'border-negative-100 bg-negative-50',
      )}
    >
      <p className="text-xs text-gray-500 mb-1">הכנסה חייבת</p>
      <p
        className={cn(
          'text-lg font-bold',
          taxableIncome >= 0 ? 'text-info-700' : 'text-negative-600',
        )}
      >
        {fmt(taxableIncome)}
      </p>
    </div>
  </div>
)

interface FinancialSectionProps {
  icon: ReactNode
  title: string
  total: number
  titleClassName: string
  headerClassName: string
  totalClassName: string
  emptyMessage: string
  isEmpty: boolean
  children: ReactNode
  footer: ReactNode
}

export const FinancialSection: React.FC<FinancialSectionProps> = ({
  icon,
  title,
  total,
  titleClassName,
  headerClassName,
  totalClassName,
  emptyMessage,
  isEmpty,
  children,
  footer,
}) => (
  <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
    <div
      className={cn('flex items-center gap-2 border-b border-gray-100 px-5 py-3', headerClassName)}
    >
      {icon}
      <h4 className={cn('text-sm font-semibold', titleClassName)}>{title}</h4>
      <span className={cn('mr-auto text-xs font-medium', totalClassName)}>{fmt(total)}</span>
    </div>
    <div className="divide-y divide-gray-50 px-1">
      {isEmpty ? (
        <p className="px-4 py-6 text-center text-sm text-gray-400">{emptyMessage}</p>
      ) : null}
      {children}
    </div>
    <div className="px-4 pb-3 pt-2">{footer}</div>
  </div>
)
