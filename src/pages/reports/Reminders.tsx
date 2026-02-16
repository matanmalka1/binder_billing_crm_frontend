import { Plus } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/Button";
import { PageLoading } from "../../components/ui/PageLoading";
import { ErrorCard } from "../../components/ui/ErrorCard";
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
    formData,
    handleFormChange,
    handleCreateSubmit,
    isSubmitting,
    cancelingId,
    handleCancel,
  } = useReminders();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="תזכורות" />
        <PageLoading message="טוען תזכורות..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="תזכורות" />
        <ErrorCard message={error} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      <RemindersSummaryCards reminders={reminders} />

      <RemindersTable
        reminders={reminders}
        cancelingId={cancelingId}
        onCancel={handleCancel}
      />

      <CreateReminderModal
        open={showCreateModal}
        formData={formData}
        isSubmitting={isSubmitting}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSubmit}
        onFormChange={handleFormChange}
      />
    </div>
  );
};
