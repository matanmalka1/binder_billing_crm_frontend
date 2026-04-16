import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notesApi, notesQK } from "../api";
import { getErrorMessage, showErrorToast } from "@/utils/utils";
import { toast } from "@/utils/toast";

const PAGE_SIZE = 50;

export const useClientNotes = (clientId: number) => {
  const queryClient = useQueryClient();
  const queryKey = [...notesQK.forClient(clientId), { page: 1, page_size: PAGE_SIZE }];

  const listQuery = useQuery({
    enabled: clientId > 0,
    queryKey,
    queryFn: () => notesApi.list(clientId, { page: 1, page_size: PAGE_SIZE }),
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: (note: string) => notesApi.create(clientId, { note }),
    onSuccess: () => {
      toast.success("הערה נוספה בהצלחה");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (err) => showErrorToast(err, "שגיאה בהוספת הערה"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ noteId, note }: { noteId: number; note: string }) =>
      notesApi.update(clientId, noteId, { note }),
    onSuccess: () => {
      toast.success("הערה עודכנה בהצלחה");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (err) => showErrorToast(err, "שגיאה בעדכון הערה"),
  });

  const deleteMutation = useMutation({
    mutationFn: (noteId: number) => notesApi.delete(clientId, noteId),
    onSuccess: () => {
      toast.success("הערה נמחקה בהצלחה");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (err) => showErrorToast(err, "שגיאה במחיקת הערה"),
  });

  const deletingId = deleteMutation.isPending ? (deleteMutation.variables ?? null) : null;

  return {
    notes: listQuery.data?.items ?? [],
    total: listQuery.data?.total ?? 0,
    isLoading: listQuery.isLoading,
    error: listQuery.error ? getErrorMessage(listQuery.error, "שגיאה בטעינת הערות") : null,
    addNote: (note: string) => createMutation.mutateAsync(note),
    isAdding: createMutation.isPending,
    updateNote: (noteId: number, note: string) => updateMutation.mutateAsync({ noteId, note }),
    isUpdating: updateMutation.isPending,
    deleteNote: (noteId: number) => deleteMutation.mutate(noteId),
    deletingId,
  };
};
