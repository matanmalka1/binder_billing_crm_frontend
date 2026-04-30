import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/primitives/Button'
import { ActiveFilterBadges } from '@/components/ui/table/ActiveFilterBadges'
import { PaginationCard } from '@/components/ui/table/PaginationCard'
import { PageStateGuard } from '@/components/ui/layout/PageStateGuard'
import {
  CreateReminderModal,
  ReminderDrawer,
  RemindersByClientList,
  RemindersFiltersBar,
  RemindersSummaryCards,
  useReminders,
} from '@/features/reminders'
import { statusLabels, type ReminderStatus } from '../types'
import { DEFAULT_REMINDER_STATUS_FILTER } from '../constants'

export const RemindersPage: React.FC = () => {
  const {
    reminders,
    page,
    pageSize,
    rawTotal,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    dueFilter,
    clearDueFilter,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    hasFilters,
    clearFilters,
    pendingCount,
    sentCount,
    showCreateModal,
    setShowCreateModal,
    form,
    onSubmit,
    isSubmitting,
    cancelingId,
    handleCancel,
    markingSentId,
    handleMarkSent,
    selectedReminder,
    setSelectedReminder,
    clientBinders,
    clientCharges,
    clientTaxDeadlines,
    clientAnnualReports,
    clientAdvancePayments,
    clientBusinesses,
    setPage,
  } = useReminders()

  const header = (
    <PageHeader
      title="ניהול תזכורות"
      description="תזכורות אוטומטיות למועדי מס, תיקים לא פעילים וחשבוניות שלא שולמו"
      actions={
        <Button
          variant="primary"
          size="md"
          onClick={() => setShowCreateModal(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          תזכורת חדשה
        </Button>
      }
    />
  )

  const renderBody = () => {
    if (reminders.length === 0) {
      if (hasFilters) {
        const statusLabel = statusFilter
          ? (statusLabels[statusFilter as ReminderStatus] ?? statusFilter)
          : 'כל הסטטוסים'

        return (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center text-gray-500">
            <p className="text-lg font-medium mb-2">לא נמצאו תזכורות</p>
            <p className="text-sm mb-4">אין תוצאות התואמות את הסינון הנוכחי.</p>
            <ActiveFilterBadges
              badges={[
                search
                  ? { key: 'search', label: `חיפוש: ${search}`, onRemove: () => setSearch('') }
                  : null,
                typeFilter
                  ? {
                      key: 'typeFilter',
                      label: `סוג: ${typeFilter}`,
                      onRemove: () => setTypeFilter(''),
                    }
                  : null,
                statusFilter !== DEFAULT_REMINDER_STATUS_FILTER
                  ? {
                      key: 'statusFilter',
                      label: `סטטוס: ${statusLabel}`,
                      onRemove: () => setStatusFilter(DEFAULT_REMINDER_STATUS_FILTER),
                    }
                  : null,
              ].filter((badge): badge is NonNullable<typeof badge> => badge !== null)}
              onReset={clearFilters}
            />
          </div>
        )
      }
      if (rawTotal === 0) {
        return (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center text-gray-500">
            <p className="text-lg font-medium mb-2">אין תזכורות להצגה</p>
            <p className="text-sm mb-4">צור תזכורת חדשה כדי להופיע כאן.</p>
            <Button variant="primary" className="gap-2" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4" />
              תזכורת חדשה
            </Button>
          </div>
        )
      }
    }

    return (
      <RemindersByClientList
        reminders={reminders}
        cancelingId={cancelingId}
        markingSentId={markingSentId}
        onCancel={handleCancel}
        onMarkSent={handleMarkSent}
        onViewDetails={setSelectedReminder}
        onRowClick={setSelectedReminder}
      />
    )
  }

  return (
    <PageStateGuard
      isLoading={isLoading}
      error={error}
      header={header}
      loadingMessage="טוען תזכורות..."
    >
      <RemindersSummaryCards
        pendingCount={pendingCount}
        sentCount={sentCount}
        activeFilter={statusFilter}
        onFilter={setStatusFilter}
      />

      <RemindersFiltersBar
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        dueFilter={dueFilter}
        onDueClear={clearDueFilter}
        hasFilters={hasFilters}
        onClear={clearFilters}
      />

      {renderBody()}

      {rawTotal > 0 && reminders.length > 0 && (
        <PaginationCard
          page={page}
          totalPages={Math.max(1, Math.ceil(rawTotal / pageSize))}
          total={rawTotal}
          label="תזכורות"
          onPageChange={setPage}
        />
      )}

      <CreateReminderModal
        open={showCreateModal}
        form={form}
        isSubmitting={isSubmitting}
        onClose={() => {
          form.reset()
          setShowCreateModal(false)
        }}
        onSubmit={onSubmit}
        clientBinders={clientBinders}
        clientCharges={clientCharges}
        clientTaxDeadlines={clientTaxDeadlines}
        clientAnnualReports={clientAnnualReports}
        clientAdvancePayments={clientAdvancePayments}
        clientBusinesses={clientBusinesses}
      />

      <ReminderDrawer reminder={selectedReminder} onClose={() => setSelectedReminder(null)} />
    </PageStateGuard>
  )
}
