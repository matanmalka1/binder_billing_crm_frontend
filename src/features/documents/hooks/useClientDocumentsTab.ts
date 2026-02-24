import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  documentsApi,
  type UploadDocumentPayload,
  type OperationalSignalsResponse,
  type PermanentDocumentListResponse,
} from "../../../api/documents.api";
import { getErrorMessage } from "../../../utils/utils";
import { toast } from "../../../utils/toast";
import { QK } from "../../../lib/queryKeys";

export const useClientDocumentsTab = (clientId: number) => {
  const queryClient = useQueryClient();
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  const uploadMutation = useMutation({
    mutationFn: (payload: UploadDocumentPayload) => documentsApi.upload(payload),
    onSuccess: async () => {
      toast.success("מסמך הועלה בהצלחה");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QK.documents.clientList(clientId) }),
        queryClient.invalidateQueries({ queryKey: QK.documents.clientSignals(clientId) }),
      ]);
    },
  });

  const submitUpload = async (
    payload: Pick<UploadDocumentPayload, "document_type" | "file">,
  ): Promise<boolean> => {
    try {
      setUploadError(null);
      await uploadMutation.mutateAsync({ client_id: clientId, ...payload });
      return true;
    } catch (requestError: unknown) {
      setUploadError(getErrorMessage(requestError, "שגיאה בהעלאת מסמך"));
      return false;
    }
  };

  const errorSource = documentsQuery.error ?? signalsQuery.error;

  return {
    documents: documentsQuery.data?.items ?? [],
    signals: signalsQuery.data ?? { client_id: clientId, missing_documents: [] },
    loading: documentsQuery.isPending || signalsQuery.isPending,
    error: errorSource ? getErrorMessage(errorSource, "שגיאה בטעינת מסמכים") : null,
    submitUpload,
    uploadError,
    uploading: uploadMutation.isPending,
  };
};
