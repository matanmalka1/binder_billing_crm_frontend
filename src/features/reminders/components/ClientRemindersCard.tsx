import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { RemindersTable } from "./RemindersTable";
import { ReminderDrawer } from "./ReminderDrawer";
import { CreateReminderModal } from "./CreateReminderModal";
import { useReminders } from "../hooks/useReminders";
import { bindersApi } from "../../../api/binders.api";
import { chargesApi } from "../../../api/charges.api";
import { taxDeadlinesApi } from "../../../api/taxDeadlines.api";

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
  } = useReminders({ clientId });

  const { data: bindersData } = useQuery({
    queryKey: ["binders", "client", clientId],
    queryFn: () => bindersApi.list({ client_id: clientId, page_size: 100 }),
    enabled: showCreateModal,
  });

  const { data: chargesData } = useQuery({
    queryKey: ["charges", "client", clientId],
    queryFn: () => chargesApi.list({ client_id: clientId, page_size: 100 }),
    enabled: showCreateModal,
  });

  const { data: taxDeadlinesData } = useQuery({
    queryKey: ["tax_deadlines", "client", clientId],
    queryFn: () => taxDeadlinesApi.listTaxDeadlines({ client_id: clientId, page_size: 100 }),
    enabled: showCreateModal,
  });

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
      {error && <p className="text-sm text-red-600">{error}</p>}
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
        clientBinders={bindersData?.items}
        clientCharges={chargesData?.items}
        clientTaxDeadlines={taxDeadlinesData?.items}
      />

      <ReminderDrawer
        reminder={selectedReminder}
        onClose={() => setSelectedReminder(null)}
      />
    </Card>
  );
};

ClientRemindersCard.displayName = "ClientRemindersCard";