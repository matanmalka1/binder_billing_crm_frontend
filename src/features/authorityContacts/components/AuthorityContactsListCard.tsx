import { Plus } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Alert } from "../../../components/ui/Alert";
import type { AuthorityContactResponse } from "../api";
import { AuthorityContactsListContent } from "./AuthorityContactsListContent";

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
    <AuthorityContactsListContent
      contacts={contacts}
      deletingId={deletingId}
      error={error}
      isLoading={isLoading}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  </Card>
);
