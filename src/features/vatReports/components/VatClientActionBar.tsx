import { Plus } from 'lucide-react'
import { Button } from '../../../components/ui/primitives/Button'
import { Select } from '../../../components/ui/inputs/Select'
import { VatExportButtons } from './VatExportButtons'

interface VatClientActionBarProps {
  clientId: number
  isAdvisor: boolean
  selectedYear: number
  yearOptions: Array<{ value: string; label: string }>
  onCreateClick: () => void
  onYearChange: (year: number) => void
}

export const VatClientActionBar = ({
  clientId,
  isAdvisor,
  selectedYear,
  yearOptions,
  onCreateClick,
  onYearChange,
}: VatClientActionBarProps) => (
  <section className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
      <div className="flex">
        <Button onClick={onCreateClick} size="sm" className="w-full justify-center sm:w-auto">
          <Plus className="h-4 w-4" />
          פתיחת תיק מע״מ
        </Button>
      </div>

      <div className="flex flex-col gap-2 border-t border-gray-100 pt-3 sm:flex-row sm:items-center md:border-t-0 md:border-r md:pr-3 md:pt-0">
        <Select
          value={String(selectedYear)}
          onChange={(e) => onYearChange(Number(e.target.value))}
          options={yearOptions}
          className="w-full py-1.5 sm:w-28"
        />
        {isAdvisor && (
          <div className="flex justify-start">
            <VatExportButtons clientId={clientId} year={selectedYear} />
          </div>
        )}
      </div>
    </div>
  </section>
)

VatClientActionBar.displayName = 'VatClientActionBar'
