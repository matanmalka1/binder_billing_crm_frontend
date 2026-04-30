import { notesApi, notesQK } from '../api'
import { notesPageParams, useNotesResource } from './useNotesResource'

export const useClientNotes = (clientId: number) => {
  const queryKey = [...notesQK.forClient(clientId), notesPageParams]

  return useNotesResource({
    enabled: clientId > 0,
    queryKey,
    list: () => notesApi.list(clientId, notesPageParams),
    create: (note) => notesApi.create(clientId, { note }),
    update: (noteId, note) => notesApi.update(clientId, noteId, { note }),
    remove: (noteId) => notesApi.delete(clientId, noteId),
  })
}
