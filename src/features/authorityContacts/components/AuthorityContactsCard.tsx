import { useState } from "react";
import { Plus } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { ErrorCard } from "../../../components/ui/ErrorCard";
import type { AuthorityContactResponse } from "../../../api/authorityContacts.api";
import { useAuthorityContacts } from "../hooks/useAuthorityContacts";
import { AuthorityContactRow } from "./AuthorityContactRow";
import { AuthorityContactModal } from "./AuthorityContactModal";

interface Props { clientId: number }

export const AuthorityContactsCard: React.FC<Props> = ({ clientId }) => {
  const { contacts, isLoading, error, deleteContact, deletingId } =
    useAuthorityContacts(clientId);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AuthorityContactResponse | null>(null);

  const handleEdit = (c: AuthorityContactResponse) => {
    setEditing(c);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <Card
      title="אנשי קשר ברשויות"
      subtitle="גורמי קשר ממשלתיים ורגולטוריים"
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="gap-2"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            הוסף איש קשר
          </Button>
        </div>

        {error && <ErrorCard message={error} />}

        {isLoading && (
          <p className="text-sm text-gray-500 text-center py-4">טוען אנשי קשר...</p>
        )}

        {!isLoading && contacts.length === 0 && !error && (
          <p className="text-sm text-gray-500 text-center py-6">
            לא נוספו עדיין אנשי קשר ברשויות
          </p>
        )}

        <div className="space-y-3">
          {contacts.map((contact) => (
            <AuthorityContactRow
              key={contact.id}
              contact={contact}
              isDeleting={deletingId === contact.id}
              onEdit={handleEdit}
              onDelete={deleteContact}
            />
          ))}
        </div>
      </div>

      <AuthorityContactModal
        open={modalOpen}
        clientId={clientId}
        existing={editing}
        onClose={handleClose}
      />
    </Card>
  );
};
