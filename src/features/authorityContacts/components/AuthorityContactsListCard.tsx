import { Plus, Users } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Alert } from "../../../components/ui/Alert";
import { StateCard } from "../../../components/ui/StateCard";
import type { AuthorityContactResponse } from "../api";
import { AuthorityContactRow } from "./AuthorityContactRow";

interface AuthorityContactsListCardProps {
  contacts: AuthorityContactResponse[];
  total: number;
  isLoading: boolean;
  error: string | null;
  deletingId: number | null;
  onCreate: () => void;
  onEdit: (contact: AuthorityContactResponse) => void;
  onDelete: (id: number) => void;
}

export const AuthorityContactsListCard: React.FC<AuthorityContactsListCardProps> = ({
  contacts,
  total,
  isLoading,
  error,
  deletingId,
  onCreate,
  onEdit,
  onDelete,
}) => (
  <Card
    title="אנשי קשר ברשויות"
    subtitle={total > 0 ? `${total} אנשי קשר` : "גורמי קשר ממשלתיים ורגולטוריים"}
    actions={
      <Button
        type="button"
        variant="primary"
        size="sm"
        className="gap-2"
        onClick={onCreate}
      >
        <Plus className="h-4 w-4" />
        הוסף
      </Button>
    }
  >
    {error && <Alert variant="error" message={error} />}

    {isLoading && (
      <p className="py-4 text-center text-sm text-gray-500">טוען אנשי קשר...</p>
    )}

    {!isLoading && !error && contacts.length === 0 && (
      <StateCard
        icon={Users}
        message="לא נוספו עדיין אנשי קשר ברשויות"
        variant="minimal"
      />
    )}

    {!isLoading && contacts.length > 0 && (
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
    )}
  </Card>
);
