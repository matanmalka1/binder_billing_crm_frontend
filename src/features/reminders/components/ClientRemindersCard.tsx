import { useState } from "react";
import { Plus } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { RemindersTable } from "./RemindersTable";
import { ReminderDrawer } from "./ReminderDrawer";
import { CreateReminderModal } from "./CreateReminderModal";
import { useReminders } from "../hooks/useReminders";
import type { Reminder } from "../reminder.types";

interface ClientRemindersCardProps {
  clientId: number;
}

export const ClientRemindersCard: React.FC<ClientRemindersCardProps> = ({ clientId }) => {
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
  } = useReminders({ clientId });

  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);

  return (
    <Card
      title="תזכורות לקוח"
      description="תזכורות פתוחות ומאוחרות עבור הלקוח"
      actions={
        <Button variant="outline" size="sm" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" />
          תזכורת חדשה
        </Button>
      }
    >
      {isLoading && <p className="text-sm text-gray-500">טוען תזכורות...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!isLoading && !error && (
        <RemindersTable
          reminders={reminders}
          cancelingId={cancelingId}
          onCancel={handleCancel}
          onRowClick={setSelectedReminder}
          showClient={false}
        />
      )}

      <CreateReminderModal
        open={showCreateModal}
        fixedClientId={clientId}
        form={form}
        isSubmitting={isSubmitting}
        onClose={() => {
          form.reset();
          setShowCreateModal(false);
        }}
        onSubmit={onSubmit}
      />

      <ReminderDrawer reminder={selectedReminder} onClose={() => setSelectedReminder(null)} />
    </Card>
  );
};
