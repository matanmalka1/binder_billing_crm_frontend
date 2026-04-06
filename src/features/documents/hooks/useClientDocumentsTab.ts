import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  documentsApi,
  documentsQK,
  type OperationalSignalsResponse,
  type PermanentDocumentListResponse,
} from "../api";
import { clientsQK } from "@/features/clients/api";
import { getErrorMessage } from "../../../utils/utils";
import { useDocumentUpload } from "./useDocumentUpload";
import { toast } from "../../../utils/toast";

export const useClientDocumentsTab = (businessId: number, taxYear?: number | null) => {
  const queryClient = useQueryClient();

  const documentsQuery = useQuery<PermanentDocumentListResponse>({
    enabled: businessId > 0,
    queryKey: documentsQK.businessListFiltered(businessId, taxYear ?? null),
    queryFn: () => documentsApi.listByClient(businessId, taxYear ? { tax_year: taxYear } : undefined),
  });

  const signalsQuery = useQuery<OperationalSignalsResponse>({
    enabled: businessId > 0,
    queryKey: documentsQK.businessSignals(businessId),
    queryFn: () => documentsApi.getSignalsByClient(businessId),
  });

  const { submitUpload, uploadError, uploading } = useDocumentUpload(businessId);

  const invalidateDocs = () => {
    void queryClient.invalidateQueries({ queryKey: documentsQK.businessList(businessId) });
    void queryClient.invalidateQueries({ queryKey: documentsQK.businessSignals(businessId) });
  };

  const handleDelete = async (id: number) => {
    await documentsApi.deleteDocument(id);
    toast.success("מסמך נמחק");
    invalidateDocs();
  };

  const handleReplace = async (id: number, file: File) => {
    await documentsApi.replaceDocument(id, file);
    toast.success("מסמך הוחלף");
    invalidateDocs();
  };

  const approveMutation = useMutation({
    mutationFn: (id: number) => documentsApi.approveDocument(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: documentsQK.businessList(businessId) });
      void queryClient.invalidateQueries({ queryKey: clientsQK.list({}) });
      toast.success("המסמך אושר");
    },
    onError: (error) => toast.error(getErrorMessage(error, "שגיאה בפעולה")),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, notes }: { id: number; notes: string }) =>
      documentsApi.rejectDocument(id, notes),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: documentsQK.businessList(businessId) });
      void queryClient.invalidateQueries({ queryKey: clientsQK.list({}) });
      toast.success("המסמך נדחה");
    },
    onError: (error) => toast.error(getErrorMessage(error, "שגיאה בפעולה")),
  });

  const updateNotesMutation = useMutation({
    mutationFn: ({ id, notes }: { id: number; notes: string }) =>
      documentsApi.updateNotes(id, notes),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: documentsQK.businessList(businessId) });
      toast.success("ההערה עודכנה");
    },
    onError: (error) => toast.error(getErrorMessage(error, "שגיאה בפעולה")),
  });

  const errorSource = documentsQuery.error ?? signalsQuery.error;

  return {
    documents: documentsQuery.data?.items ?? [],
    signals: signalsQuery.data ?? { client_id: businessId, missing_documents: [] },
    loading: documentsQuery.isPending || signalsQuery.isPending,
    error: errorSource ? getErrorMessage(errorSource, "שגיאה בטעינת מסמכים") : null,
    submitUpload,
    uploadError,
    uploading,
    handleDelete,
    handleReplace,
    handleApprove: (id: number) => approveMutation.mutate(id),
    handleReject: (id: number, notes: string) => rejectMutation.mutate({ id, notes }),
    handleUpdateNotes: (id: number, notes: string) => updateNotesMutation.mutate({ id, notes }),
  };
};
