import { useState } from "react";
import { Plus, Users, ChevronRight, ChevronLeft } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Alert } from "../../../components/ui/Alert";
import { StateCard } from "../../../components/ui/StateCard";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import type { AuthorityContactResponse } from "../api";
import { useAuthorityContacts } from "../hooks/useAuthorityContacts";
import { AuthorityContactRow } from "./AuthorityContactRow";
import { AuthorityContactModal } from "./AuthorityContactModal";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AuthorityContactResponse | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const handleEdit = (contact: AuthorityContactResponse) => {
    setEditing(contact);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <Card
      title="אנשי קשר ברשויות"
      subtitle={total > 0 ? `${total} אנשי קשר` : "גורמי קשר ממשלתיים ורגולטוריים"}
      actions={
        <Button
          type="button"
          variant="primary"
          size="sm"
          className="gap-2"
          onClick={() => setModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          הוסף
        </Button>
      }
    >
      {error && <Alert variant="error" message={error} />}

      {isLoading && (
        <p className="text-sm text-gray-500 text-center py-4">טוען אנשי קשר...</p>
      )}

      {!isLoading && !error && contacts.length === 0 && (
        <StateCard
          icon={Users}
          message="לא נוספו עדיין אנשי קשר ברשויות"
          variant="minimal"
        />
      )}

      {contacts.length > 0 && (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <AuthorityContactRow
              key={contact.id}
              contact={contact}
              isDeleting={deletingId === contact.id}
              onEdit={handleEdit}
              onDelete={(id) => setConfirmDeleteId(id)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronRight className="h-4 w-4" />
            הקודם
          </Button>
          <span className="text-xs text-gray-500">
            עמוד {page} מתוך {totalPages}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            הבא
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}

      <AuthorityContactModal
        open={modalOpen}
        clientId={clientId}
        existing={editing}
        onClose={handleClose}
      />

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="מחיקת איש קשר"
        message="האם למחוק את איש הקשר? פעולה זו אינה הפיכה."
        confirmLabel="מחק"
        cancelLabel="ביטול"
        isLoading={deletingId === confirmDeleteId}
        onConfirm={() => { if (confirmDeleteId !== null) deleteContact(confirmDeleteId); setConfirmDeleteId(null); }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </Card>
  );
};
