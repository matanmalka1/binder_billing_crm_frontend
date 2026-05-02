import { useMemo } from 'react'
import { CalendarClock } from 'lucide-react'
import { Alert } from '@/components/ui/overlays/Alert'
import { ConfirmDialog } from '@/components/ui/overlays/ConfirmDialog'
import { SignatureRequestsDashboardPanel } from '@/features/signatureRequests'
import {
  AttentionPanel,
  DashboardOnboardingEmptyState,
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
import type { UnifiedItem } from '@/features/tasks'

const getUnifiedItemHref = (item: UnifiedItem) => {
  if (item.item_type === 'reminder') return '/reminders'

  switch (item.source_type) {
    case 'vat_filing':
      return '/tax/vat'
    case 'annual_report':
      return '/tax/reports'
    case 'advance_payment':
      return '/tax/advance-payments'
    case 'unpaid_charge':
      return '/charges'
    case 'tax_deadline':
    default:
      return '/tax/deadlines'
  }
}

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
    emptyState,
    attentionEmptyChecks,
    stats,
    unifiedItems,
  } = useDashboardPage()

  const attentionSections = useMemo<PanelSection[]>(() => {
    const base = attentionSectionsToPanelSections(attentionItems)
    if (!isAdvisorView) return base

    return [
      ...base,
      {
        key: 'unified_tasks',
        title: 'מה צריך לעשות עכשיו',
        icon: CalendarClock,
        tone: 'amber',
        items: unifiedItems.map((item) => ({
          id: `${item.item_type}-${item.source_type}-${item.source_id}`,
          label: item.label,
          sublabel: item.due_date,
          href: getUnifiedItemHref(item),
        })),
      },
      ...(quickActions?.length ? quickActionsToPanelSections(quickActions) : []),
    ]
  }, [attentionItems, quickActions, isAdvisorView, unifiedItems])

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
      ) : emptyState?.is_empty ? (
        <DashboardOnboardingEmptyState />
      ) : dashboard.status === 'ok' ? (
        <DashboardStatsGrid stats={stats} />
      ) : null}

      {isAdvisorView && !emptyState?.is_empty && <SeasonSummaryWidget />}

      {dashboard.status === 'loading' ? (
        <div className="h-80 animate-pulse rounded-2xl bg-gray-100" />
      ) : isAdvisorView ? (
        <AttentionPanel
          sections={attentionSections}
          emptyChecks={attentionEmptyChecks}
          activeActionKey={activeQuickAction}
          onAction={handleQuickAction}
        />
      ) : (
        <AttentionPanel sections={attentionSections} emptyChecks={attentionEmptyChecks} />
      )}

      {isAdvisorView && !emptyState?.is_empty && <SignatureRequestsDashboardPanel compact />}

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
