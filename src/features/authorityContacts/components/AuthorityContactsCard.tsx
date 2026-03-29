import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { PaginationCard } from "../../../components/ui/PaginationCard";
import { useAuthorityContacts } from "../hooks/useAuthorityContacts";
import { useAuthorityContactsCardState } from "../hooks/useAuthorityContactsCardState";
import { AuthorityContactModal } from "./AuthorityContactModal";
import { AuthorityContactsListCard } from "./AuthorityContactsListCard";

interface AuthorityContactsCardProps {
  clientId: number;
}

export const AuthorityContactsCard: React.FC<AuthorityContactsCardProps> = ({ clientId }) => {
  const {
    contacts,
    total,
    page,
    setPage,
    totalPages,
    isLoading,
    error,
    deleteContact,
    deletingId,
  } = useAuthorityContacts(clientId);
  const {
    editing,
    isModalOpen,
    confirmDeleteId,
    openCreate,
    openEdit,
    closeModal,
    requestDelete,
    clearDeleteRequest,
  } = useAuthorityContactsCardState();

  return (
    <div className="space-y-4">
      <AuthorityContactsListCard
        contacts={contacts}
        total={total}
        isLoading={isLoading}
        error={error}
        deletingId={deletingId}
        onCreate={openCreate}
        onEdit={openEdit}
        onDelete={requestDelete}
      />

      {totalPages > 1 && (
        <PaginationCard
          page={page}
          totalPages={totalPages}
          total={total}
          label="אנשי קשר"
          onPageChange={setPage}
        />
      )}

      <AuthorityContactModal
        open={isModalOpen}
        clientId={clientId}
        existing={editing}
        onClose={closeModal}
      />

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="מחיקת איש קשר"
        message="האם למחוק את איש הקשר? פעולה זו אינה הפיכה."
        confirmLabel="מחק"
        cancelLabel="ביטול"
        isLoading={deletingId === confirmDeleteId}
        onConfirm={() => {
          if (confirmDeleteId !== null) {
            deleteContact(confirmDeleteId);
          }
          clearDeleteRequest();
        }}
        onCancel={clearDeleteRequest}
      />
    </div>
  );
};
