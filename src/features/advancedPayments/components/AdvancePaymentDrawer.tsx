import { useState, useEffect } from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { DetailDrawer, DrawerField, DrawerSection } from '../../../components/ui/overlays/DetailDrawer'
import { Input } from '../../../components/ui/inputs/Input'
import { Select } from '../../../components/ui/inputs/Select'
import { DatePicker } from '../../../components/ui/inputs/DatePicker'
import { Button } from '../../../components/ui/primitives/Button'
import type { AdvancePaymentRow, UpdateAdvancePaymentPayload } from '../types'
import { ADVANCE_PAYMENT_STATUS_OPTIONS, ADVANCE_PAYMENT_METHOD_OPTIONS } from '../constants'
import { fmtCurrency, getAdvancePaymentMonthLabel } from '../utils'
import { formatDate } from '../../../utils/utils'
import { toEditableAmount } from './advancePaymentComponent.utils'
import { toast } from '../../../utils/toast'

interface AdvancePaymentDrawerProps {
  row: AdvancePaymentRow | null
  open: boolean
  isUpdating: boolean
  isDeleting?: boolean
  canEdit: boolean
  onClose: () => void
  onSave: (id: number, payload: UpdateAdvancePaymentPayload) => Promise<void>
  onDelete?: (id: number) => Promise<void>
}

export const AdvancePaymentDrawer: React.FC<AdvancePaymentDrawerProps> = ({
  row,
  open,
  isUpdating,
  isDeleting = false,
  canEdit,
  onClose,
  onSave,
  onDelete,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [paidAmount, setPaidAmount] = useState('')
  const [expectedAmount, setExpectedAmount] = useState('')
  const [status, setStatus] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [paidAt, setPaidAt] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!row) return
    setPaidAmount(toEditableAmount(row.paid_amount))
    setExpectedAmount(toEditableAmount(row.expected_amount))
    setStatus(row.status)
    setPaymentMethod(row.payment_method ?? '')
    setPaidAt(row.paid_at ? row.paid_at.split('T')[0] : '')
    setNotes(row.notes ?? '')
    setConfirmDelete(false)
  }, [row])

  if (!row) return null

  const isDirty =
    toEditableAmount(row.paid_amount) !== paidAmount ||
    toEditableAmount(row.expected_amount) !== expectedAmount ||
    row.status !== status ||
    (row.payment_method ?? '') !== paymentMethod ||
    (row.paid_at ? row.paid_at.split('T')[0] : '') !== paidAt ||
    (row.notes ?? '') !== notes

  const handleSave = async () => {
    const payload: UpdateAdvancePaymentPayload = {}
    const numericPaid = Number(paidAmount || 0)
    const numericExpected = Number(expectedAmount)

    if (!Number.isFinite(numericPaid) || numericPaid < 0) {
      toast.error('סכום ששולם חייב להיות מספר תקין שאינו שלילי')
      return
    }
    if ((status === 'paid' || status === 'partial') && numericPaid <= 0) {
      toast.error('סטטוס שולם או חלקי מחייב סכום ששולם גדול מאפס')
      return
    }
    if (status === 'paid' && expectedAmount !== '' && Number.isFinite(numericExpected) && numericPaid < numericExpected) {
      toast.error('סכום ששולם נמוך מהסכום הצפוי. יש לבחור סטטוס חלקי')
      return
    }

    if (paidAmount !== toEditableAmount(row.paid_amount)) payload.paid_amount = paidAmount === '' ? '0' : paidAmount
    if (expectedAmount !== toEditableAmount(row.expected_amount))
      payload.expected_amount = expectedAmount === '' ? null : expectedAmount
    if (status !== row.status) payload.status = status as UpdateAdvancePaymentPayload['status']
    if (paymentMethod !== (row.payment_method ?? ''))
      payload.payment_method = (paymentMethod || null) as UpdateAdvancePaymentPayload['payment_method']
    if (paidAt !== (row.paid_at ? row.paid_at.split('T')[0] : '')) payload.paid_at = paidAt || null
    if (notes !== (row.notes ?? '')) payload.notes = notes || null

    if (Object.keys(payload).length === 0) return onClose()
    await onSave(row.id, payload)
  }

  const turnoverLabel = row.reported_turnover
    ? `${fmtCurrency(row.reported_turnover)} (מאושר)`
    : row.live_turnover
      ? `${fmtCurrency(row.live_turnover)} (מחזור חי מדוח מע"מ)`
      : null

  const title = getAdvancePaymentMonthLabel(row.period, row.period_months_count)

  return (
    <DetailDrawer
      open={open}
      title={title}
      subtitle={row.business_name ?? undefined}
      onClose={onClose}
      isDirty={isDirty}
      footer={
        canEdit ? (
          <div className="flex items-center justify-between gap-2">
            {onDelete &&
              (confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-error-600">למחוק?</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-error-600 hover:bg-error-50"
                    isLoading={isDeleting}
                    onClick={() => onDelete(row.id)}
                  >
                    כן, מחק
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)} disabled={isDeleting}>
                    ביטול
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-error-600 hover:bg-error-50"
                  onClick={() => setConfirmDelete(true)}
                  disabled={isUpdating}
                >
                  <Trash2 size={14} />
                </Button>
              ))}
            <div className="flex gap-2 mr-auto">
              <Button variant="outline" onClick={onClose} disabled={isUpdating || isDeleting}>
                ביטול
              </Button>
              <Button variant="primary" isLoading={isUpdating} onClick={handleSave} disabled={isDeleting}>
                שמור
              </Button>
            </div>
          </div>
        ) : undefined
      }
    >
      <div className="space-y-5">
        {row.missing_turnover && (
          <div className="flex items-start gap-2 rounded-lg bg-warning-50 border border-warning-200 px-3 py-2.5">
            <AlertTriangle className="h-4 w-4 text-warning-600 mt-0.5 shrink-0" />
            <p className="text-sm text-warning-700">חסר מחזור לתקופה — לא ניתן לחשב מקדמה מדויקת</p>
          </div>
        )}

        <DrawerSection title="פרטי תקופה">
          <DrawerField label="תאריך יעד" value={formatDate(row.due_date)} />
          <DrawerField
            label="מחזור לתקופה"
            value={turnoverLabel ?? <span className="text-gray-400 text-xs">דוח מע״מ טרם הוגש</span>}
          />
          {row.timing_status === 'overdue' && (
            <DrawerField
              label="סטטוס עמידה"
              value={<span className="text-error-600 text-xs font-medium">באיחור</span>}
            />
          )}
          {row.paid_late && (
            <DrawerField
              label="סטטוס עמידה"
              value={<span className="text-warning-600 text-xs font-medium">שולם באיחור</span>}
            />
          )}
        </DrawerSection>

        {canEdit ? (
          <DrawerSection title="עדכון תשלום">
            <div className="py-3 space-y-3">
              <Input
                label="סכום שולם"
                type="number"
                min={0}
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
              />
              <Input
                label="סכום צפוי"
                type="number"
                min={0}
                value={expectedAmount}
                onChange={(e) => setExpectedAmount(e.target.value)}
              />
              <Select
                label="סטטוס"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={ADVANCE_PAYMENT_STATUS_OPTIONS}
              />
              <Select
                label="שיטת תשלום"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                options={[{ value: '', label: 'ללא' }, ...ADVANCE_PAYMENT_METHOD_OPTIONS]}
              />
              <DatePicker label="תאריך ביצוע תשלום" value={paidAt} onChange={setPaidAt} />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">הערות</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="הערות..."
                />
              </div>
            </div>
          </DrawerSection>
        ) : (
          <DrawerSection title="פרטי תשלום">
            <DrawerField label="סכום שולם" value={fmtCurrency(row.paid_amount)} />
            <DrawerField label="סכום צפוי" value={fmtCurrency(row.expected_amount)} />
            <DrawerField label="שיטת תשלום" value={row.payment_method ?? null} />
            <DrawerField label="תאריך ביצוע" value={row.paid_at ? formatDate(row.paid_at) : null} />
            <DrawerField label="הערות" value={row.notes} />
          </DrawerSection>
        )}
      </div>
    </DetailDrawer>
  )
}

AdvancePaymentDrawer.displayName = 'AdvancePaymentDrawer'
