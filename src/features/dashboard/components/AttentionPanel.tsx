import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react'
import { cn } from '@/utils/utils'
import type { ActionCommand } from '@/lib/actions/types'
import type { AttentionEmptyCheck } from '../api'
import type { PanelItem, PanelSection, AttentionTone } from '../attentionPanelSections'
import { DashboardEmptyState, DashboardPanel, DashboardSectionHeader } from './DashboardPrimitives'

const ATTENTION_BATCH_SIZE = 5

const toneTab: Record<AttentionTone, string> = {
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  green: 'bg-green-50 text-green-700 border-green-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
}

const toneIcon: Record<AttentionTone, string> = {
  amber: 'bg-amber-50 text-amber-600',
  green: 'bg-green-50 text-green-600',
  red: 'bg-red-50 text-red-600',
  blue: 'bg-blue-50 text-blue-600',
}

const toneAccent: Record<AttentionTone, string> = {
  amber: 'border-r-amber-300',
  green: 'border-r-green-300',
  red: 'border-r-red-400',
  blue: 'border-r-blue-300',
}

const tonePill: Record<AttentionTone, string> = {
  amber: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  green: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  red: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  blue: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
}

const toneBtn: Record<AttentionTone, string> = {
  amber: 'bg-amber-500 hover:bg-amber-600 text-white',
  green: 'bg-green-600 hover:bg-green-700 text-white',
  red: 'bg-red-600 hover:bg-red-700 text-white',
  blue: 'bg-blue-600 hover:bg-blue-700 text-white',
}

interface RowCardProps {
  item: PanelItem
  tone: AttentionTone
  activeActionKey: string | null
  onAction: (action: ActionCommand) => void
}

const RowCard = ({ item, tone, activeActionKey, onAction }: RowCardProps) => {
  const action = item.actions?.[0] ?? null
  const { meta } = item
  const badgeTone = meta?.badgeTone ?? tone
  const tagTone = meta?.tagTone ?? tone

  // In RTL context: first child renders on the RIGHT, last child on the LEFT
  // So: text block first (right), action/arrow last (left)
  const rowInner = (
    <>
      {/* RIGHT: text */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-bold text-gray-900">{item.label}</p>
          {meta?.badge && (
            <span
              className={cn(
                'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold',
                tonePill[badgeTone],
              )}
            >
              {meta.badge}
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          {item.sublabel && <span className="truncate text-xs text-gray-500">{item.sublabel}</span>}
          {meta?.tag && (
            <span
              className={cn(
                'shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold',
                tonePill[tagTone],
              )}
            >
              {meta.tag}
            </span>
          )}
        </div>
        {meta?.description && (
          <p className="mt-1 truncate text-xs font-medium text-gray-600">{meta.description}</p>
        )}
      </div>

      {/* LEFT: action button or arrow */}
      {action ? (
        (() => {
          const isLoading = activeActionKey === action.action.uiKey
          const isDisabled = activeActionKey !== null && !isLoading
          const btnTone =
            action.urgency === 'overdue' ? 'red' : action.urgency === 'upcoming' ? 'amber' : tone
          return (
            <button
              disabled={isDisabled || isLoading}
              onClick={() => onAction(action.action)}
              className={cn(
                'shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                isLoading
                  ? 'cursor-wait bg-gray-100 text-gray-400'
                  : isDisabled
                    ? 'cursor-not-allowed bg-gray-100 text-gray-300'
                    : toneBtn[btnTone],
              )}
            >
              {isLoading ? (
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  מבצע...
                </span>
              ) : (
                action.label
              )}
            </button>
          )
        })()
      ) : (
        <ArrowLeft className="h-3.5 w-3.5 shrink-0 text-gray-300 transition-colors group-hover:text-blue-400" />
      )}
    </>
  )

  const baseClass = cn(
    'flex items-center gap-3 border-r-2 bg-white px-4 py-3 transition-colors',
    toneAccent[tone],
  )

  if (action) {
    return <div className={baseClass}>{rowInner}</div>
  }

  return (
    <Link to={item.href} className={cn('group', baseClass, 'hover:bg-slate-50/80')}>
      {rowInner}
    </Link>
  )
}

interface AttentionPanelProps {
  sections: PanelSection[]
  emptyChecks?: AttentionEmptyCheck[]
  activeActionKey?: string | null
  onAction?: (action: ActionCommand) => void
}

export const AttentionPanel = ({
  sections,
  emptyChecks = [],
  activeActionKey = null,
  onAction = () => {},
}: AttentionPanelProps) => {
  const sectionEntries = useMemo(
    () =>
      sections.map((section, index) => ({
        section,
        stateKey: `${section.key}:${index}`,
      })),
    [sections],
  )
  const totalItems = sections.reduce((n, s) => n + s.items.length, 0)

  const [activeTab, setActiveTab] = useState(() => sectionEntries[0]?.stateKey ?? '')
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({})

  const activeEntry = sectionEntries.find((entry) => entry.stateKey === activeTab)

  useEffect(() => {
    if (sectionEntries.length === 0) {
      setActiveTab('')
      return
    }
    if (!sectionEntries.some((entry) => entry.stateKey === activeTab)) {
      setActiveTab(sectionEntries[0].stateKey)
    }
  }, [activeTab, sectionEntries])

  const toggleGroup = (section: PanelSection, stateKey: string) =>
    setVisibleCounts((prev) => {
      const current = prev[stateKey] ?? ATTENTION_BATCH_SIZE
      const nextCount =
        current >= section.items.length ? ATTENTION_BATCH_SIZE : current + ATTENTION_BATCH_SIZE

      return { ...prev, [stateKey]: nextCount }
    })

  return (
    <DashboardPanel>
      <div className="border-b border-gray-100 px-5 py-4">
        <DashboardSectionHeader
          icon={ShieldAlert}
          title="לוח תשומת לב"
          subtitle={
            totalItems === 0
              ? 'הכל תקין — אין דברים ממתינים'
              : `${totalItems} פריטים ממתינים לטיפול`
          }
          count={totalItems}
          tone={totalItems > 0 ? 'amber' : 'neutral'}
        />
      </div>

      {sectionEntries.length === 0 ? (
        <div className="px-5 py-6">
          <DashboardEmptyState
            icon={CheckCircle2}
            title="כל הפריטים תחת שליטה"
            description="אין דחיפויות כרגע"
            className="py-5"
          />
          {emptyChecks.length > 0 && (
            <div className="grid grid-cols-1 gap-2 border-t border-gray-100 pt-4 sm:grid-cols-2">
              {emptyChecks.map((check) => (
                <div
                  key={check.key}
                  className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {check.label}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex gap-1 overflow-x-auto border-b border-gray-100 bg-gray-50/60 px-4 py-2.5">
            {sectionEntries.map(({ section, stateKey }) => {
              const isActive = activeTab === stateKey
              const Icon = section.icon
              return (
                <button
                  key={stateKey}
                  onClick={() => setActiveTab(stateKey)}
                  className={cn(
                    'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                    isActive
                      ? 'bg-white shadow-sm text-gray-900'
                      : 'text-gray-500 hover:text-gray-700',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded',
                      toneIcon[section.tone],
                    )}
                  >
                    <Icon className="h-2.5 w-2.5" />
                  </span>
                  {section.title}
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                      isActive ? cn('border', toneTab[section.tone]) : 'bg-gray-200 text-gray-600',
                    )}
                  >
                    {section.items.length}
                  </span>
                </button>
              )
            })}
          </div>

          {activeEntry &&
            (() => {
              const { section: activeSection, stateKey } = activeEntry
              const visibleCount = visibleCounts[stateKey] ?? ATTENTION_BATCH_SIZE
              const visibleItems = activeSection.items.slice(0, visibleCount)
              const remainingCount = activeSection.items.length - visibleItems.length
              const canCollapse = visibleItems.length > ATTENTION_BATCH_SIZE
              const hasMore = remainingCount > 0

              return (
                <>
                  <div key={activeSection.key} className="divide-y divide-gray-100">
                    {visibleItems.length > 0 ? (
                      visibleItems.map((item) => (
                        <RowCard
                          key={item.id}
                          item={item}
                          tone={activeSection.tone}
                          activeActionKey={activeActionKey}
                          onAction={onAction}
                        />
                      ))
                    ) : (
                      <DashboardEmptyState
                        icon={CheckCircle2}
                        title="אין פריטים בקטגוריה"
                        description="אין משימות פתוחות כרגע"
                        className="py-8"
                      />
                    )}
                  </div>

                  {(hasMore || canCollapse) && (
                    <div className="flex border-t border-gray-100">
                      {canCollapse && (
                        <button
                          onClick={() =>
                            setVisibleCounts((prev) => ({
                              ...prev,
                              [stateKey]: ATTENTION_BATCH_SIZE,
                            }))
                          }
                          className={cn(
                            'flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-400 transition-colors hover:bg-slate-50 hover:text-gray-600',
                            hasMore && 'border-l border-gray-100',
                          )}
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                          הצג פחות
                        </button>
                      )}

                      {hasMore && (
                        <button
                          onClick={() => toggleGroup(activeSection, stateKey)}
                          className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-400 transition-colors hover:bg-slate-50 hover:text-gray-600"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                          {`הצג עוד ${Math.min(ATTENTION_BATCH_SIZE, remainingCount)}`}
                        </button>
                      )}
                    </div>
                  )}
                </>
              )
            })()}
        </>
      )}
    </DashboardPanel>
  )
}

AttentionPanel.displayName = 'AttentionPanel'
