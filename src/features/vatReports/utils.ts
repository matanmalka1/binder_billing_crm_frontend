import { CATEGORY_LABELS } from './constants'
import { EXPENSE_CATEGORIES } from './constants'
import type { VatInvoiceRowValues } from './schemas/invoice.schema'
import { semanticMonoToneClasses } from '../../utils/semanticColors'

export const canMarkMaterialsComplete = (status: string): boolean => status === 'pending_materials'

export const canAddInvoice = (status: string): boolean =>
  status === 'material_received' ||
  status === 'data_entry_in_progress' ||
  status === 'ready_for_review'

export const canMarkReadyForReview = (status: string): boolean =>
  status === 'data_entry_in_progress'

export const canSendBack = (status: string): boolean => status === 'ready_for_review'

export const canFile = (status: string): boolean => status === 'ready_for_review'

export const isFiled = (status: string): boolean => status === 'filed'

/** Formats a VAT amount as ₪X.XX, or "—" for null/NaN */
export const formatVatAmount = (amount: string | number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return '—'
  return `₪${Number(amount).toFixed(2)}`
}

/** LTR-safe currency (negative sign before ₪), or "—" for null/NaN */
export const formatVatAmountLtrSafe = (amount: string | number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return '—'
  const n = Number(amount)
  return n < 0 ? `-₪${Math.abs(n).toFixed(2)}` : `₪${n.toFixed(2)}`
}

export const getVatDeductionRateLabel = (rate: string | number): string => {
  const numeric = Number(rate)
  if (numeric === 1) return '100%'
  if (numeric === 0) return '0%'
  return `${(numeric * 100).toFixed(2)}%`
}

export const getVatDeductionRateClass = (rate: string | number): string => {
  const numeric = Number(rate)
  if (numeric === 1) return `${semanticMonoToneClasses.positive} font-semibold`
  if (numeric === 0) return 'text-gray-400'
  return `${semanticMonoToneClasses.warning} font-semibold`
}

export const toDateInputValue = (dateStr: string): string => {
  try {
    return new Date(dateStr).toISOString().slice(0, 10)
  } catch {
    return ''
  }
}

export const getVatCategoryLabel = (category: string | null): string =>
  CATEGORY_LABELS[category ?? ''] ?? category ?? 'כללי'

export const getVatInvoiceDefaultValues = (
  invoiceType: 'income' | 'expense',
): VatInvoiceRowValues => ({
  invoice_type: invoiceType,
  net_amount: '',
  expense_category: invoiceType === 'expense' ? EXPENSE_CATEGORIES[0] : undefined,
})
