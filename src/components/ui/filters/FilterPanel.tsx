import { Search, X } from 'lucide-react'
import { useSearchDebounce } from '@/hooks/useSearchDebounce'
import { Input } from '@/components/ui/inputs/Input'
import { Select } from '@/components/ui/inputs/Select'
import { DatePicker } from '@/components/ui/inputs/DatePicker'
import { ToolbarContainer } from '@/components/ui/layout/ToolbarContainer'
import { ActiveFilterBadges } from '@/components/ui/table/ActiveFilterBadges'
import { ClientFilterControl } from '@/components/shared/client/ClientFilterControl'
import type { FilterBadge } from '@/components/ui/table/ActiveFilterBadges'
import { cn } from '@/utils/utils'
import { useState, useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react'

// ─── Field Definitions ───────────────────────────────────────────────────────

export interface SearchFieldDef {
  type: 'search'
  key: string
  label: string
  placeholder?: string
}

export interface SelectFieldDef {
  type: 'select'
  key: string
  label: string
  options: { value: string; label: string }[]
  /** Treated as "no active filter" for badge purposes. Default: '' */
  defaultValue?: string
}

export interface DateFieldDef {
  type: 'date'
  key: string
  label: string
}

export interface DateRangeFieldDef {
  type: 'date-range'
  fromKey: string
  toKey: string
  fromLabel: string
  toLabel: string
}

export interface ClientPickerFieldDef {
  type: 'client-picker'
  idKey: string
  nameKey?: string
  label?: string
  placeholder?: string
}

export type FilterFieldDef =
  | SearchFieldDef
  | SelectFieldDef
  | DateFieldDef
  | DateRangeFieldDef
  | ClientPickerFieldDef

// ─── SearchField ─────────────────────────────────────────────────────────────

interface SearchFieldHandle {
  reset: () => void
}

const SearchFieldInner = forwardRef<
  SearchFieldHandle,
  {
    field: SearchFieldDef
    externalValue: string
    onChange: (key: string, value: string) => void
  }
>(({ field, externalValue, onChange }, ref) => {
  const [draft, setDraft] = useSearchDebounce(externalValue, (v) => onChange(field.key, v))

  useImperativeHandle(ref, () => ({
    reset: () => setDraft(''),
  }))

  return (
    <Input
      label={field.label}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      placeholder={field.placeholder}
      startIcon={<Search className="h-4 w-4" />}
      endElement={
        draft ? (
          <button
            type="button"
            onClick={() => {
              setDraft('')
              onChange(field.key, '')
            }}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : undefined
      }
    />
  )
})
SearchFieldInner.displayName = 'SearchFieldInner'

// ─── ClientPickerField ────────────────────────────────────────────────────────

function ClientPickerField({
  field,
  values,
  onChange,
}: {
  field: ClientPickerFieldDef
  values: Record<string, string>
  onChange: (key: string, value: string) => void
}) {
  const idVal = values[field.idKey]
  const nameVal = field.nameKey ? values[field.nameKey] : undefined
  const [clientQuery, setClientQuery] = useState(nameVal ?? '')
  const selectedClient = idVal ? { id: Number(idVal), name: nameVal ?? `#${idVal}` } : null

  useEffect(() => {
    if (!idVal) setClientQuery('')
  }, [idVal])

  return (
    <ClientFilterControl
      label={field.label}
      placeholder={field.placeholder}
      selectedClient={selectedClient}
      clientQuery={clientQuery}
      onQueryChange={setClientQuery}
      onSelect={(client) => {
        setClientQuery(client.name)
        onChange(field.idKey, String(client.id))
        if (field.nameKey) onChange(field.nameKey, client.name)
      }}
      onClear={() => {
        onChange(field.idKey, '')
        if (field.nameKey) onChange(field.nameKey, '')
      }}
    />
  )
}

// ─── FilterPanel ─────────────────────────────────────────────────────────────

export interface FilterPanelProps {
  fields: FilterFieldDef[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: Record<string, any>
  onChange: (key: string, value: string) => void
  onReset: () => void
  /** Tailwind grid class. Default: 'grid-cols-1 sm:grid-cols-3' */
  gridClass?: string
  /** Extra content rendered above ToolbarContainer (e.g. StatsCard pills) */
  above?: React.ReactNode
  /** Extra badge(s) appended to the auto-generated badge list */
  extraBadges?: FilterBadge[]
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  fields,
  values,
  onChange,
  onReset,
  gridClass = 'grid-cols-1 sm:grid-cols-3',
  above,
  extraBadges,
}) => {
  // Refs to imperatively reset search field drafts on full reset
  const searchRefs = useRef<Record<string, SearchFieldHandle | null>>({})

  const handleReset = useCallback(() => {
    for (const ref of Object.values(searchRefs.current)) {
      ref?.reset()
    }
    onReset()
  }, [onReset])

  // ── Build badges ────────────────────────────────────────────────────────────
  const badges: FilterBadge[] = []

  for (const field of fields) {
    if (field.type === 'search') {
      const v = values[field.key]
      if (v)
        badges.push({
          key: field.key,
          label: `${field.label}: ${v}`,
          onRemove: () => {
            searchRefs.current[field.key]?.reset()
            onChange(field.key, '')
          },
        })
    } else if (field.type === 'select') {
      const v = values[field.key]
      const defaultV = field.defaultValue ?? ''
      if (v && v !== defaultV) {
        const label = field.options.find((o) => o.value === v)?.label ?? v
        badges.push({ key: field.key, label, onRemove: () => onChange(field.key, defaultV) })
      }
    } else if (field.type === 'date') {
      const v = values[field.key]
      if (v)
        badges.push({
          key: field.key,
          label: `${field.label}: ${v}`,
          onRemove: () => onChange(field.key, ''),
        })
    } else if (field.type === 'date-range') {
      const from = values[field.fromKey]
      const to = values[field.toKey]
      if (from)
        badges.push({
          key: field.fromKey,
          label: `${field.fromLabel}: ${from}`,
          onRemove: () => onChange(field.fromKey, ''),
        })
      if (to)
        badges.push({
          key: field.toKey,
          label: `${field.toLabel}: ${to}`,
          onRemove: () => onChange(field.toKey, ''),
        })
    } else if (field.type === 'client-picker') {
      const id = values[field.idKey]
      const nameKey = field.nameKey
      const name = nameKey ? values[nameKey] : undefined
      if (id)
        badges.push({
          key: field.idKey,
          label: `לקוח: ${name ?? `#${id}`}`,
          onRemove: () => {
            onChange(field.idKey, '')
            if (nameKey) onChange(nameKey, '')
          },
        })
    }
  }

  const allBadges = extraBadges ? [...badges, ...extraBadges] : badges

  return (
    <div className="space-y-3">
      {above}
      <ToolbarContainer>
        <div className="space-y-3">
          <div className={cn('grid gap-3', gridClass)}>
            {fields.map((field) => {
              if (field.type === 'search') {
                return (
                  <SearchFieldInner
                    key={field.key}
                    ref={(el) => {
                      searchRefs.current[field.key] = el
                    }}
                    field={field}
                    externalValue={values[field.key] ?? ''}
                    onChange={onChange}
                  />
                )
              }

              if (field.type === 'select') {
                const v = values[field.key] ?? ''
                const isActive = v !== '' && v !== (field.defaultValue ?? '')
                return (
                  <Select
                    key={field.key}
                    label={field.label}
                    value={v}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    options={field.options}
                    className={cn(isActive && 'border-primary-400 ring-1 ring-primary-200')}
                  />
                )
              }

              if (field.type === 'date') {
                return (
                  <DatePicker
                    key={field.key}
                    label={field.label}
                    value={values[field.key] ?? ''}
                    onChange={(v) => onChange(field.key, v)}
                  />
                )
              }

              if (field.type === 'date-range') {
                return (
                  <>
                    <DatePicker
                      key={field.fromKey}
                      label={field.fromLabel}
                      value={values[field.fromKey] ?? ''}
                      onChange={(v) => onChange(field.fromKey, v)}
                    />
                    <DatePicker
                      key={field.toKey}
                      label={field.toLabel}
                      value={values[field.toKey] ?? ''}
                      onChange={(v) => onChange(field.toKey, v)}
                    />
                  </>
                )
              }

              if (field.type === 'client-picker') {
                return (
                  <ClientPickerField
                    key={field.idKey}
                    field={field}
                    values={values}
                    onChange={onChange}
                  />
                )
              }

              return null
            })}
          </div>

          <ActiveFilterBadges badges={allBadges} onReset={handleReset} />
        </div>
      </ToolbarContainer>
    </div>
  )
}

FilterPanel.displayName = 'FilterPanel'
