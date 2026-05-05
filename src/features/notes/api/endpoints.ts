export const NOTES_ENDPOINTS = {
  notesList: (clientId: number | string) => `/clients/${clientId}/notes`,
  noteById: (clientId: number | string, noteId: number | string) => `/clients/${clientId}/notes/${noteId}`,
  businessNotesList: (clientId: number | string, businessId: number | string) =>
    `/clients/${clientId}/businesses/${businessId}/notes`,
  businessNoteById: (clientId: number | string, businessId: number | string, noteId: number | string) =>
    `/clients/${clientId}/businesses/${businessId}/notes/${noteId}`,
} as const
