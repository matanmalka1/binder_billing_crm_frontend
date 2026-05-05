import { Bell, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/primitives/Button'
import { PaginationCard } from '@/components/ui/table/PaginationCard'
import { PageStateGuard } from '@/components/ui/layout/PageStateGuard'
import { StateCard } from '@/components/ui/feedback/StateCard'
import {
  CreateReminderModal,
  ReminderDrawer,
  RemindersByClientList,
  RemindersFiltersBar,
  RemindersSummaryCards,
  useReminders,
} from '@/features/reminders'
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
    clientBusinesses,
    setPage,
  } = useReminders()

  const header = (
    <PageHeader
      title="ניהול תזכורות"
      description="תזכורות ידניות שהמשתמש יצר למעקב אישי"
      actions={
        <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(true)} className="gap-2">
          תזכורת חדשה
          <Plus className="h-4 w-4" />
        </Button>
      }
    />
  )

  const renderBody = () => {
    if (reminders.length === 0) {
      if (hasFilters) {
        return (
          <StateCard
            icon={Bell}
            title="לא נמצאו תזכורות"
            message="לא נמצאו תזכורות התואמות את הסינון"
            secondaryAction={{ label: 'אפס סינון', onClick: clearFilters }}
          />
        )
      }
      if (rawTotal === 0) {
        return (
          <StateCard
            icon={Bell}
            variant="illustration"
            title="עדיין אין תזכורות במערכת"
            message="צור תזכורת ידנית חדשה כדי להופיע כאן."
            action={{ label: 'תזכורת חדשה', onClick: () => setShowCreateModal(true) }}
          />
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
    <PageStateGuard isLoading={isLoading} error={error} header={header} loadingMessage="טוען תזכורות...">
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
        clientBusinesses={clientBusinesses}
      />

      <ReminderDrawer reminder={selectedReminder} onClose={() => setSelectedReminder(null)} />
    </PageStateGuard>
  )
}
