import { Search, X } from 'lucide-react'
import { Input } from '../../../components/ui/inputs/Input'
import { Select } from '../../../components/ui/inputs/Select'
import { ToolbarContainer } from '../../../components/ui/layout/ToolbarContainer'
import { ActiveFilterBadges } from '../../../components/ui/table/ActiveFilterBadges'
import { useSearchDebounce } from '../../../hooks/useSearchDebounce'
import { cn } from '../../../utils/utils'
import type { UsersFilters } from '../types'

interface UsersFiltersBarProps {
  filters: UsersFilters
  onFilterChange: (key: string, value: string) => void
}

const ACTIVE_OPTIONS = [
  { value: '', label: 'כל המשתמשים' },
  { value: 'true', label: 'פעילים בלבד' },
  { value: 'false', label: 'לא פעילים' },
]

export const UsersFiltersBar: React.FC<UsersFiltersBarProps> = ({ filters, onFilterChange }) => {
  const [searchDraft, setSearchDraft] = useSearchDebounce(filters.search ?? '', (value) =>
    onFilterChange('search', value),
  )

  const handleReset = () => {
    setSearchDraft('')
    onFilterChange('search', '')
    onFilterChange('is_active', '')
  }

  return (
    <ToolbarContainer>
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="חיפוש משתמש"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="שם או כתובת מייל..."
            startIcon={<Search className="h-4 w-4" />}
            endElement={
              searchDraft ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchDraft('')
                    onFilterChange('search', '')
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : undefined
            }
          />
          <Select
            label="סטטוס"
            value={filters.is_active ?? ''}
            onChange={(e) => onFilterChange('is_active', e.target.value)}
            options={ACTIVE_OPTIONS}
            className={cn(filters.is_active && 'border-primary-400 ring-1 ring-primary-200')}
          />
        </div>

        <ActiveFilterBadges
          badges={[
            filters.search
              ? {
                  key: 'search',
                  label: `חיפוש: ${filters.search}`,
                  onRemove: () => {
                    setSearchDraft('')
                    onFilterChange('search', '')
                  },
                }
              : null,
            filters.is_active
              ? {
                  key: 'is_active',
                  label:
                    ACTIVE_OPTIONS.find((option) => option.value === filters.is_active)?.label ??
                    filters.is_active,
                  onRemove: () => onFilterChange('is_active', ''),
                }
              : null,
          ].filter((badge): badge is NonNullable<typeof badge> => badge !== null)}
          onReset={handleReset}
        />
      </div>
    </ToolbarContainer>
  )
}
