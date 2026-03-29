import { Mail, MapPin, Phone } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import { getContactTypeLabel, type AuthorityContactResponse } from "../api";

interface AuthorityContactDetailsProps {
  contact: AuthorityContactResponse;
}

export const AuthorityContactDetails: React.FC<AuthorityContactDetailsProps> = ({ contact }) => (
  <div className="flex-1 space-y-1.5">
    <div className="flex items-center gap-2">
      <Badge variant="info">{getContactTypeLabel(contact.contact_type)}</Badge>
      <span className="font-medium text-gray-900">{contact.name}</span>
    </div>

    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
      {contact.office && (
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {contact.office}
        </span>
      )}
      {contact.phone && (
        <span className="flex items-center gap-1">
          <Phone className="h-3.5 w-3.5 shrink-0" />
          {contact.phone}
        </span>
      )}
      {contact.email && (
        <span className="flex items-center gap-1">
          <Mail className="h-3.5 w-3.5 shrink-0" />
          {contact.email}
        </span>
      )}
    </div>

    {contact.notes && (
      <p className="mt-1.5 border-t border-gray-100 pt-1.5 text-sm text-gray-500">
        {contact.notes}
      </p>
    )}
  </div>
);
