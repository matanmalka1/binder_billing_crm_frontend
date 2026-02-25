import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { clientsApi } from "../../../api/clients.api";
import {
  documentsApi,
  type OperationalSignalsResponse,
  type PermanentDocumentListResponse,
} from "../../../api/documents.api";
import { getErrorMessage, isPositiveInt } from "../../../utils/utils";
import { QK } from "../../../lib/queryKeys";
import { useDocumentUpload } from "./useDocumentUpload";

export const useDocumentsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedClientId = useMemo(() => {
    const raw = Number(searchParams.get("client_id") || 0);
    return isPositiveInt(raw) ? raw : 0;
  }, [searchParams]);

  const clientsQuery = useQuery({
    queryKey: QK.documents.clients,
    queryFn: async () => {
      const response = await clientsApi.list({ page: 1, page_size: 100 });
      return (response.items ?? []).map(({ id, full_name }) => ({ id, full_name }));
    },
  });

  const documentsQuery = useQuery<PermanentDocumentListResponse>({
    enabled: selectedClientId > 0,
    queryKey: QK.documents.clientList(selectedClientId),
    queryFn: () => documentsApi.listByClient(selectedClientId),
  });

  const signalsQuery = useQuery<OperationalSignalsResponse>({
    enabled: selectedClientId > 0,
    queryKey: QK.documents.clientSignals(selectedClientId),
    queryFn: () => documentsApi.getSignalsByClient(selectedClientId),
  });

  const { submitUpload, uploadError, uploading } = useDocumentUpload(selectedClientId);

  const setClient = (clientId: string) => {
    const next = new URLSearchParams(searchParams);
    if (clientId) next.set("client_id", clientId);
    else next.delete("client_id");
    setSearchParams(next);
  };

  const loading =
    clientsQuery.isPending ||
    (selectedClientId > 0 && (documentsQuery.isPending || signalsQuery.isPending));

  const errorSource = clientsQuery.error ?? documentsQuery.error ?? signalsQuery.error;

  return {
    clientOptions: clientsQuery.data ?? [],
    documents: documentsQuery.data?.items ?? [],
    error: errorSource ? getErrorMessage(errorSource, "שגיאה בטעינת מסמכים") : null,
    loading,
    selectedClientId,
    setClient,
    signals: signalsQuery.data ?? { client_id: 0, missing_documents: [] },
    submitUpload,
    uploadError,
    uploading,
  };
};