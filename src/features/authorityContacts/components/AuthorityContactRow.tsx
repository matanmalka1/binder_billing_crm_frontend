import { Edit2, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import type { AuthorityContactResponse } from "../../../api/authorityContacts.api";
import { getContactTypeLabel } from "../../../api/authorityContacts.utils";

interface Props {
  contact: AuthorityContactResponse;
  isDeleting: boolean;
  onEdit: (contact: AuthorityContactResponse) => void;
  onDelete: (id: number) => void;
}

export const AuthorityContactRow: React.FC<Props> = ({ contact, isDeleting, onEdit, onDelete }) => (
  <div className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
    <div className="flex-1 space-y-1">
      <div className="flex items-center gap-2">
        <Badge variant="info">{getContactTypeLabel(contact.contact_type)}</Badge>
        <span className="font-medium text-gray-900">{contact.name}</span>
      </div>
      {contact.office && <p className="text-sm text-gray-600">📍 {contact.office}</p>}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        {contact.phone && <span>📞 {contact.phone}</span>}
        {contact.email && <span>✉️ {contact.email}</span>}
      </div>
      {contact.notes && (
        <p className="text-sm text-gray-500 border-t border-gray-100 pt-1 mt-1">{contact.notes}</p>
      )}
    </div>
    <div className="flex gap-1 shrink-0">
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
  </div>
);
