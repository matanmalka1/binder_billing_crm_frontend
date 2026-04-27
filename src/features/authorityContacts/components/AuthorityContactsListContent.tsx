import { Users } from "lucide-react";
import { StateCard } from "../../../components/ui/feedback/StateCard";
import type { AuthorityContactResponse } from "../api";
import { AuthorityContactRow } from "./AuthorityContactRow";

interface AuthorityContactsListContentProps {
  contacts: AuthorityContactResponse[];
  deletingId: number | null;
  error: string | null;
  isLoading: boolean;
  onEdit: (contact: AuthorityContactResponse) => void;
  onDelete: (id: number) => void;
}

export const AuthorityContactsListContent: React.FC<AuthorityContactsListContentProps> = ({
  contacts,
  deletingId,
  error,
  isLoading,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return <p className="py-4 text-center text-sm text-gray-500">טוען אנשי קשר...</p>;
  }

  if (!error && contacts.length === 0) {
    return (
      <StateCard
        icon={Users}
        message="לא נוספו עדיין אנשי קשר ברשויות"
        size="compact"
        variant="minimal"
      />
    );
  }

  if (contacts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {contacts.map((contact) => (
        <AuthorityContactRow
          key={contact.id}
          contact={contact}
          isDeleting={deletingId === contact.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
