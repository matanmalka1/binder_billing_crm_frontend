import { useBusinessNotes } from "../hooks/useBusinessNotes";
import { NotesCard } from "./NotesCard";

interface Props {
  clientId: number;
  businessId: number;
  canEdit: boolean;
}

export const BusinessNotesCard = ({ clientId, businessId, canEdit }: Props) => {
  const hook = useBusinessNotes(clientId, businessId);
  return <NotesCard hook={hook} canEdit={canEdit} />;
};
