import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage, showErrorToast } from "@/utils/utils";
import { toast } from "@/utils/toast";

const PAGE_SIZE = 50;
const PAGE_PARAMS = { page: 1, page_size: PAGE_SIZE };

interface UseNotesResourceOptions<TNote> {
  enabled: boolean;
  queryKey: unknown[];
  list: () => Promise<{ items: TNote[]; total: number }>;
  create: (note: string) => Promise<TNote>;
  update: (noteId: number, note: string) => Promise<TNote>;
  remove: (noteId: number) => Promise<unknown>;
}

export const notesPageParams = PAGE_PARAMS;

export const useNotesResource = <TNote>({
  enabled,
  queryKey,
  list,
  create,
  update,
  remove,
}: UseNotesResourceOptions<TNote>) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    enabled,
    queryKey,
    queryFn: list,
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success("הערה נוספה בהצלחה");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (err) => showErrorToast(err, "שגיאה בהוספת הערה"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ noteId, note }: { noteId: number; note: string }) => update(noteId, note),
    onSuccess: () => {
      toast.success("הערה עודכנה בהצלחה");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (err) => showErrorToast(err, "שגיאה בעדכון הערה"),
  });

  const deleteMutation = useMutation({
    mutationFn: remove,
    onSuccess: () => {
      toast.success("הערה נמחקה בהצלחה");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (err) => showErrorToast(err, "שגיאה במחיקת הערה"),
  });

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
    deletingId: deleteMutation.isPending ? (deleteMutation.variables ?? null) : null,
  };
};
