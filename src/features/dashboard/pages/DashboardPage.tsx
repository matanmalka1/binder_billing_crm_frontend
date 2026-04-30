import { useMemo } from 'react'
import { Bell, CalendarClock } from 'lucide-react'
import { Alert } from '@/components/ui/overlays/Alert'
import { ConfirmDialog } from '@/components/ui/overlays/ConfirmDialog'
import {
  AttentionPanel,
  DashboardStatsGrid,
  SeasonSummaryWidget,
  useDashboardPage,
} from '@/features/dashboard'
import { DASHBOARD_COPY, DASHBOARD_LOADING_CARD_COUNT } from '../dashboardConstants'
import { DashboardSurface } from '../components/DashboardPrimitives'
import {
  attentionSectionsToPanelSections,
  quickActionsToPanelSections,
  type PanelSection,
} from '../attentionPanelSections'

const StatsSkeleton = () => (
  <div className="grid animate-pulse grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
    {Array.from({ length: DASHBOARD_LOADING_CARD_COUNT }, (_, i) => (
      <div key={i} className="h-32 rounded-xl bg-gray-100" />
    ))}
  </div>
)

export const DashboardPage: React.FC = () => {
  const {
    activeQuickAction,
    attentionItems,
    dashboard,
    denied,
    handleQuickAction,
    isAdvisorView,
    confirmPendingAction,
    cancelPendingAction,
    pendingQuickAction,
    quickActions,
    advisorToday,
    stats,
  } = useDashboardPage()

  const attentionSections = useMemo<PanelSection[]>(() => {
    const base = attentionSectionsToPanelSections(attentionItems)
    if (!isAdvisorView) return base

    return [
      ...base,
      {
        key: 'deadlines',
        title: 'מועדי הגשה החודש',
        icon: CalendarClock,
        tone: 'amber',
        viewAllHref: '/tax/deadlines',
        items: (advisorToday?.deadline_items ?? []).map((item) => ({
          id: `deadline-${item.id}`,
          label: item.label,
          sublabel: item.sublabel ?? undefined,
          href: item.href ?? '/tax/deadlines',
          meta: item.description ? { description: item.description } : undefined,
        })),
      },
      {
        key: 'open_reminders',
        title: 'תזכורות פתוחות',
        icon: Bell,
        tone: 'blue',
        viewAllHref: '/reminders',
        items: (advisorToday?.reminder_items ?? []).map((item) => ({
          id: `reminder-${item.id}`,
          label: item.label,
          sublabel: item.sublabel ?? undefined,
          href: item.href ?? '/reminders',
        })),
      },
      ...(quickActions?.length ? quickActionsToPanelSections(quickActions) : []),
    ]
  }, [attentionItems, advisorToday, quickActions, isAdvisorView])

  return (
    <DashboardSurface>
      <div className="px-1">
        <h1 className="text-2xl font-bold text-gray-950">{DASHBOARD_COPY.pageTitle}</h1>
        <p className="mt-1 text-sm text-gray-500">{DASHBOARD_COPY.pageSubtitle}</p>
      </div>

      {denied && <Alert variant="warning" message={DASHBOARD_COPY.permissionDenied} />}
      {dashboard.status === 'error' && !denied && (
        <Alert variant="error" message={dashboard.message} />
      )}

      {dashboard.status === 'loading' ? (
        <StatsSkeleton />
      ) : dashboard.status === 'ok' ? (
        <DashboardStatsGrid stats={stats} />
      ) : null}

      {isAdvisorView && <SeasonSummaryWidget />}

      {dashboard.status === 'loading' ? (
        <div className="h-80 animate-pulse rounded-2xl bg-gray-100" />
      ) : isAdvisorView ? (
        <AttentionPanel
          sections={attentionSections}
          activeActionKey={activeQuickAction}
          onAction={handleQuickAction}
        />
      ) : (
        <AttentionPanel sections={attentionSections} />
      )}

      <ConfirmDialog
        open={Boolean(pendingQuickAction)}
        title={pendingQuickAction?.confirm?.title || DASHBOARD_COPY.confirmTitle}
        message={pendingQuickAction?.confirm?.message || DASHBOARD_COPY.confirmMessage}
        confirmLabel={pendingQuickAction?.confirm?.confirmLabel || DASHBOARD_COPY.confirmLabel}
        cancelLabel={pendingQuickAction?.confirm?.cancelLabel || DASHBOARD_COPY.cancelLabel}
        isLoading={activeQuickAction === pendingQuickAction?.uiKey}
        onConfirm={confirmPendingAction}
        onCancel={cancelPendingAction}
      />
    </DashboardSurface>
  )
}
