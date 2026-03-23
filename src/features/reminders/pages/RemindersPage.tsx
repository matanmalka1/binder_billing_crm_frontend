import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { PageStateGuard } from "@/components/ui/PageStateGuard";
import {
  CreateReminderModal,
  ReminderDrawer,
  RemindersSummaryCards,
  RemindersTable,
  useReminders,
} from "@/features/reminders";

export const RemindersPage: React.FC = () => {
  const {
    reminders,
    isLoading,
    error,
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
  } = useReminders();

  const [statusFilter, setStatusFilter] = useState("");

  const filteredReminders = useMemo(() => {
    if (!statusFilter) return reminders;
    return reminders.filter((r) => r.status === statusFilter);
  }, [reminders, statusFilter]);

  const header = (
    <PageHeader
      title="ניהול תזכורות"
      description="תזכורות אוטומטיות למועדי מס, תיקים לא פעילים וחשבוניות שלא שולמו"
      actions={
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          תזכורת חדשה
        </Button>
      }
    />
  );

  return (
    <PageStateGuard
      isLoading={isLoading}
      error={error}
      header={header}
      loadingMessage="טוען תזכורות..."
    >
      <RemindersSummaryCards
        reminders={reminders}
        activeFilter={statusFilter}
        onFilter={setStatusFilter}
      />

      {reminders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-600">
          <p className="text-lg font-semibold mb-2">אין תזכורות להצגה</p>
          <p className="text-sm mb-4">צור תזכורת חדשה כדי להופיע כאן.</p>
          <Button variant="primary" className="gap-2" onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4" />
            תזכורת חדשה
          </Button>
        </div>
      ) : (
        <RemindersTable
          reminders={filteredReminders}
          cancelingId={cancelingId}
          markingSentId={markingSentId}
          onCancel={handleCancel}
          onMarkSent={handleMarkSent}
          onViewDetails={setSelectedReminder}
          onRowClick={setSelectedReminder}
        />
      )}

      <CreateReminderModal
        open={showCreateModal}
        form={form}
        isSubmitting={isSubmitting}
        onClose={() => {
          form.reset();
          setShowCreateModal(false);
        }}
        onSubmit={onSubmit}
      />

      <ReminderDrawer
        reminder={selectedReminder}
        onClose={() => setSelectedReminder(null)}
      />
    </PageStateGuard>
  );
};
