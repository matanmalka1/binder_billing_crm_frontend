import { Plus } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/Button";
import { PageStateGuard } from "../../components/ui/PageStateGuard";
import { RemindersSummaryCards } from "../../features/reminders/components/RemindersSummaryCards";
import { RemindersTable } from "../../features/reminders/components/RemindersTable";
import { CreateReminderModal } from "../../features/reminders/components/CreateReminderModal";
import { useReminders } from "../../features/reminders/hooks/useReminders";

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
  } = useReminders();

  const header = (
    <PageHeader
      title="ניהול תזכורות"
      description="תזכורות אוטומטיות למועדי מס, תיקים לא פעילים וחשבוניות שלא שולמו"
      variant="gradient"
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
      <RemindersSummaryCards reminders={reminders} />

      <RemindersTable
        reminders={reminders}
        cancelingId={cancelingId}
        onCancel={handleCancel}
      />

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
    </PageStateGuard>
  );
};
