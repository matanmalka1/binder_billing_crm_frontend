import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  documentsApi,
  type OperationalSignalsResponse,
  type PermanentDocumentListResponse,
} from "../../../api/documents.api";
import { getErrorMessage } from "../../../utils/utils";
import { QK } from "../../../lib/queryKeys";
import { useDocumentUpload } from "./useDocumentUpload";
import { toast } from "../../../utils/toast";

export const useClientDocumentsTab = (clientId: number) => {
  const queryClient = useQueryClient();

  const documentsQuery = useQuery<PermanentDocumentListResponse>({
    enabled: clientId > 0,
    queryKey: QK.documents.clientList(clientId),
    queryFn: () => documentsApi.listByClient(clientId),
  });

  const signalsQuery = useQuery<OperationalSignalsResponse>({
    enabled: clientId > 0,
    queryKey: QK.documents.clientSignals(clientId),
    queryFn: () => documentsApi.getSignalsByClient(clientId),
  });

  const { submitUpload, uploadError, uploading } = useDocumentUpload(clientId);

  const invalidateDocs = () => {
    void queryClient.invalidateQueries({ queryKey: QK.documents.clientList(clientId) });
    void queryClient.invalidateQueries({ queryKey: QK.documents.clientSignals(clientId) });
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

  const errorSource = documentsQuery.error ?? signalsQuery.error;

  return {
    documents: documentsQuery.data?.items ?? [],
    signals: signalsQuery.data ?? { client_id: clientId, missing_documents: [] },
    loading: documentsQuery.isPending || signalsQuery.isPending,
    error: errorSource ? getErrorMessage(errorSource, "שגיאה בטעינת מסמכים") : null,
    submitUpload,
    uploadError,
    uploading,
    handleDelete,
    handleReplace,
  };
};