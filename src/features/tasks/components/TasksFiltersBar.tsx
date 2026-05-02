import { Select } from '@/components/ui/inputs/Select'
import { Button } from '@/components/ui/primitives/Button'
import { taskTypeLabels, taskUrgencyLabels, taskTypeValues, taskUrgencyValues } from '../constants'

interface TasksFiltersBarProps {
  typeFilter: string | null
  onTypeChange: (value: string | null) => void
  hasFilters: boolean
  onClear: () => void
}

const typeOptions = [
  { value: '', label: 'כל הסוגים' },
  ...taskTypeValues.map((v) => ({ value: v, label: taskTypeLabels[v] })),
]

export const TasksFiltersBar: React.FC<TasksFiltersBarProps> = ({
  typeFilter,
  onTypeChange,
  hasFilters,
  onClear,
}) => (
  <div className="flex items-center gap-3 flex-wrap">
    <Select
      options={typeOptions}
      value={typeFilter ?? ''}
      onChange={(e) => onTypeChange(e.target.value || null)}
      className="w-44"
    />
    {hasFilters && (
      <Button variant="ghost" size="sm" onClick={onClear}>
        אפס סינון
      </Button>
    )}
  </div>
)
