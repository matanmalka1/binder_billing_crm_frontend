import { notesApi, notesQK } from "../api";
import { notesPageParams, useNotesResource } from "./useNotesResource";

export const useBusinessNotes = (clientId: number, businessId: number) => {
  const queryKey = [...notesQK.forBusiness(businessId), notesPageParams];

  return useNotesResource({
    enabled: clientId > 0 && businessId > 0,
    queryKey,
    list: () => notesApi.listForBusiness(clientId, businessId, notesPageParams),
    create: (note) => notesApi.createForBusiness(clientId, businessId, { note }),
    update: (noteId, note) => notesApi.updateForBusiness(clientId, businessId, noteId, { note }),
    remove: (noteId) => notesApi.deleteForBusiness(clientId, businessId, noteId),
  });
};
