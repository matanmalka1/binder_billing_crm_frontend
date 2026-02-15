import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { clientsApi } from "../../../api/clients.api";
import {
  documentsApi,
  type OperationalSignalsResponse,
  type UploadDocumentPayload,
} from "../../../api/documents.api";
import { getRequestErrorMessage } from "../../../utils/errorHandler";
import { resolveQueryErrorMessage } from "../../../utils/queryError";
import { emptySignals } from "../constants/emptySignals";
import { documentsKeys } from "../queryKeys";

export const useDocumentsPage = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const selectedClientId = useMemo(() => {
    const raw = Number(searchParams.get("client_id") || 0);
    return Number.isInteger(raw) && raw > 0 ? raw : 0;
  }, [searchParams]);

  const clientsQuery = useQuery({
    queryKey: documentsKeys.clients(),
    queryFn: async () => {
      const response = await clientsApi.list({ page: 1, page_size: 100 });
      return (response.items ?? []).map((item) => ({
        id: item.id,
        full_name: item.full_name,
      }));
    },
  });

  const documentsQuery = useQuery({
    enabled: selectedClientId > 0,
    queryKey: documentsKeys.listByClient(selectedClientId),
    queryFn: () => documentsApi.listByClient(selectedClientId),
  });

  const signalsQuery = useQuery({
    enabled: selectedClientId > 0,
    queryKey: documentsKeys.signalsByClient(selectedClientId),
    queryFn: () => documentsApi.getSignalsByClient(selectedClientId),
  });

  const uploadMutation = useMutation({
    mutationFn: (payload: UploadDocumentPayload) => documentsApi.upload(payload),
    onSuccess: async (_, variables) => {
      toast.success("מסמך הועלה בהצלחה");
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: documentsKeys.listByClient(variables.client_id),
        }),
        queryClient.invalidateQueries({
          queryKey: documentsKeys.signalsByClient(variables.client_id),
        }),
      ]);
    },
  });

  const setClient = (clientId: string) => {
    const next = new URLSearchParams(searchParams);
    if (clientId) next.set("client_id", clientId);
    else next.delete("client_id");
    setSearchParams(next);
  };

  const submitUpload = async (
    payload: Pick<UploadDocumentPayload, "document_type" | "file">,
  ): Promise<boolean> => {
    if (!selectedClientId) {
      setUploadError("יש לבחור לקוח לפני העלאה");
      return false;
    }
    try {
      setUploadError(null);
      await uploadMutation.mutateAsync({
        client_id: selectedClientId,
        document_type: payload.document_type,
        file: payload.file,
      });
      return true;
    } catch (requestError: unknown) {
      setUploadError(getRequestErrorMessage(requestError, "שגיאה בהעלאת מסמך"));
      return false;
    }
  };

  const loading =
    clientsQuery.isPending ||
    (selectedClientId > 0 && (documentsQuery.isPending || signalsQuery.isPending));

  const errorSource = clientsQuery.error || documentsQuery.error || signalsQuery.error;
  const error = errorSource
    ? resolveQueryErrorMessage(errorSource, "שגיאה בטעינת מסמכים")
    : null;

  return {
    clientOptions: clientsQuery.data ?? [],
    documents: documentsQuery.data?.items ?? [],
    error,
    loading,
    selectedClientId,
    setClient,
    signals: (signalsQuery.data ?? emptySignals) as OperationalSignalsResponse,
    submitUpload,
    uploadError,
    uploading: uploadMutation.isPending,
  };
};
