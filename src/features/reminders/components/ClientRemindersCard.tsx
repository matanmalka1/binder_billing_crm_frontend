import { Plus } from "lucide-react";
import { Card } from "../../../components/ui/primitives/Card";
import { Button } from "../../../components/ui/primitives/Button";
import { RemindersTable } from "./RemindersTable";
import { ReminderDrawer } from "./ReminderDrawer";
import { CreateReminderModal } from "./CreateReminderModal";
import { useReminders } from "../hooks/useReminders";

interface ClientRemindersCardProps {
  clientId: number;
  clientName?: string;
}

export const ClientRemindersCard: React.FC<ClientRemindersCardProps> = ({
  clientId,
  clientName,
}) => {
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
    clientBinders,
    clientCharges,
    clientTaxDeadlines,
    clientAnnualReports,
    clientAdvancePayments,
    clientBusinesses,
  } = useReminders({ clientId, clientName });

  return (
    <Card
      title="תזכורות לקוח"
      subtitle="תזכורות פתוחות ומאוחרות עבור הלקוח"
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-4 w-4" />
          תזכורת חדשה
        </Button>
      }
    >
      {isLoading && <p className="text-sm text-gray-500">טוען תזכורות...</p>}
      {error && <p className="text-sm text-negative-600">{error}</p>}
      {!isLoading && !error && (
        <RemindersTable
          reminders={reminders}
          cancelingId={cancelingId}
          markingSentId={markingSentId}
          onCancel={handleCancel}
          onMarkSent={handleMarkSent}
          onViewDetails={setSelectedReminder}
          onRowClick={setSelectedReminder}
          showClient={false}
        />
      )}

      <CreateReminderModal
        open={showCreateModal}
        fixedClientId={clientId}
        fixedClientName={clientName}
        form={form}
        isSubmitting={isSubmitting}
        onClose={() => {
          form.reset();
          setShowCreateModal(false);
        }}
        onSubmit={onSubmit}
        clientBinders={clientBinders}
        clientCharges={clientCharges}
        clientTaxDeadlines={clientTaxDeadlines}
        clientAnnualReports={clientAnnualReports}
        clientAdvancePayments={clientAdvancePayments}
        clientBusinesses={clientBusinesses}
      />

      <ReminderDrawer
        reminder={selectedReminder}
        onClose={() => setSelectedReminder(null)}
      />
    </Card>
  );
};

ClientRemindersCard.displayName = "ClientRemindersCard";
