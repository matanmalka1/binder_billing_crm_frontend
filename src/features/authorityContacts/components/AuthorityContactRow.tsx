import type { AuthorityContactResponse } from "../api";
import { AuthorityContactActions } from "./AuthorityContactActions";
import { AuthorityContactDetails } from "./AuthorityContactDetails";

interface AuthorityContactRowProps {
  contact: AuthorityContactResponse;
  isDeleting: boolean;
  onEdit: (contact: AuthorityContactResponse) => void;
  onDelete: (id: number) => void;
}

export const AuthorityContactRow: React.FC<AuthorityContactRowProps> = ({
  contact,
  isDeleting,
  onEdit,
  onDelete,
}) => (
  <div className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
    <AuthorityContactDetails contact={contact} />
    <AuthorityContactActions
      contact={contact}
      isDeleting={isDeleting}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  </div>
);
