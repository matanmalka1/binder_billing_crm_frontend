import { useState } from 'react'
import type { AdvancePaymentStatus } from '../types'
import { Button } from '../../../components/ui/primitives/Button'
import { Select } from '../../../components/ui/inputs/Select'
import { ConfirmDialog } from '../../../components/ui/overlays/ConfirmDialog'
import { getAdvancePaymentStatusLabel } from '../../../utils/enums'
import { YEAR_OPTIONS } from '../utils'
import { ADVANCE_PAYMENT_FREQUENCY_OPTIONS, ADVANCE_PAYMENT_STATUS_FILTERS } from '../constants'
import { toFrequency } from './advancePaymentComponent.utils'
import {
  HEADER_STATUS_ACTIVE_CLASS,
  HEADER_STATUS_INACTIVE_CLASS,
} from './advancePaymentComponent.constants'

interface ClientAdvancePaymentsHeaderProps {
  isAdvisor: boolean
  statusFilter: AdvancePaymentStatus[]
  onToggleStatus: (status: AdvancePaymentStatus) => void
  year: number
  onYearChange: (year: number) => void
  onOpenCreate: () => void
  onGenerateSchedule: () => void
  generationFrequency: 1 | 2
  onGenerationFrequencyChange: (frequency: 1 | 2) => void
  isGenerating?: boolean
}

export const ClientAdvancePaymentsHeader: React.FC<ClientAdvancePaymentsHeaderProps> = ({
  isAdvisor,
  statusFilter,
  onToggleStatus,
  year,
  onYearChange,
  onOpenCreate,
  onGenerateSchedule,
  generationFrequency,
  onGenerationFrequencyChange,
  isGenerating,
}) => {
  const [confirmGenerate, setConfirmGenerate] = useState(false)

  return (
  <div className="flex items-center justify-between">
    {isAdvisor && (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={onOpenCreate}>
          הוסף מקדמה
        </Button>
        <div className="w-32">
          <Select
            value={String(generationFrequency)}
            onChange={(e) => onGenerationFrequencyChange(toFrequency(e.target.value))}
            options={ADVANCE_PAYMENT_FREQUENCY_OPTIONS}
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => setConfirmGenerate(true)} disabled={isGenerating}>
          {isGenerating ? 'יוצר...' : 'צור לוח מקדמות לשנה'}
        </Button>
        <ConfirmDialog
          open={confirmGenerate}
          title="יצירת לוח מקדמות"
          message={`ליצור מקדמות לשנת ${year}? מקדמות קיימות לא יושפעו.`}
          confirmLabel="צור"
          cancelLabel="ביטול"
          onConfirm={() => { setConfirmGenerate(false); onGenerateSchedule() }}
          onCancel={() => setConfirmGenerate(false)}
        />
      </div>
    )}
    <div className="flex items-center gap-2">
      <div className="flex flex-wrap gap-1">
        {ADVANCE_PAYMENT_STATUS_FILTERS.map((status) => {
          const active = statusFilter.includes(status)
          return (
            <Button
              key={status}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onToggleStatus(status)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                active ? HEADER_STATUS_ACTIVE_CLASS : HEADER_STATUS_INACTIVE_CLASS
              }`}
            >
              {getAdvancePaymentStatusLabel(status)}
            </Button>
          )
        })}
      </div>
      <div className="w-28">
        <Select
          value={String(year)}
          onChange={(e) => onYearChange(Number(e.target.value))}
          options={YEAR_OPTIONS}
        />
      </div>
    </div>
  </div>
  )
}

ClientAdvancePaymentsHeader.displayName = 'ClientAdvancePaymentsHeader'
