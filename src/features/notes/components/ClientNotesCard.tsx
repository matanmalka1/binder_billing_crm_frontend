import { useClientNotes } from '../hooks/useClientNotes'
import { NotesCard } from './NotesCard'

interface Props {
  clientId: number
  canEdit: boolean
}

export const ClientNotesCard = ({ clientId, canEdit }: Props) => {
  const hook = useClientNotes(clientId)
  return <NotesCard hook={hook} canEdit={canEdit} />
}
