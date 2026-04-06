import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Card } from "../../../components/ui/primitives/Card";
import { Button } from "../../../components/ui/primitives/Button";
import { RemindersTable } from "./RemindersTable";
import { ReminderDrawer } from "./ReminderDrawer";
import { CreateReminderModal } from "./CreateReminderModal";
import { useReminders } from "../hooks/useReminders";
import { bindersApi, bindersQK } from "@/features/binders/api";
import { chargesApi, chargesQK } from "@/features/charges/api";
import { taxDeadlinesApi, taxDeadlinesQK } from "@/features/taxDeadlines/api";

interface ClientRemindersCardProps {
  clientId: number;
  businessId: number;
  clientName?: string;
}

export const ClientRemindersCard: React.FC<ClientRemindersCardProps> = ({
  clientId,
  businessId,
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
  } = useReminders({ clientId: businessId });

  const { data: bindersData } = useQuery({
    queryKey: bindersQK.forClient(clientId),
    queryFn: () => bindersApi.list({ client_id: clientId, page_size: 100 }),
    enabled: showCreateModal,
  });

  const { data: chargesData } = useQuery({
    queryKey: chargesQK.list({ client_id: clientId, page_size: 100 }),
    queryFn: () => chargesApi.list({ client_id: clientId, page_size: 100 }),
    enabled: showCreateModal,
  });

  const { data: taxDeadlinesData } = useQuery({
    queryKey: taxDeadlinesQK.list({ business_name: clientName, page_size: 100 }),
    queryFn: () => taxDeadlinesApi.listTaxDeadlines({ business_name: clientName, page_size: 100 }),
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
