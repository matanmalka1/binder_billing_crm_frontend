import { Edit2, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import type { AuthorityContactResponse } from "../api";

interface AuthorityContactActionsProps {
  contact: AuthorityContactResponse;
  isDeleting: boolean;
  onEdit: (contact: AuthorityContactResponse) => void;
  onDelete: (id: number) => void;
}

export const AuthorityContactActions: React.FC<AuthorityContactActionsProps> = ({
  contact,
  isDeleting,
  onEdit,
  onDelete,
}) => (
  <div className="flex shrink-0 gap-1">
    <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(contact)}>
      <Edit2 className="h-4 w-4" />
    </Button>
    <Button
      type="button"
      variant="ghost"
      size="sm"
      isLoading={isDeleting}
      onClick={() => onDelete(contact.id)}
      className="text-red-600 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);
