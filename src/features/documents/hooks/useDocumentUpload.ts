import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { documentsApi, type UploadDocumentPayload } from "../../../api/documents.api";
import { getErrorMessage } from "../../../utils/utils";
import { toast } from "../../../utils/toast";
import { QK } from "../../../lib/queryKeys";

export const useDocumentUpload = (clientId: number) => {
  const queryClient = useQueryClient();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: (payload: UploadDocumentPayload) => documentsApi.upload(payload),
    onSuccess: async (_, variables) => {
      toast.success("מסמך הועלה בהצלחה");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QK.documents.clientList(variables.client_id) }),
        queryClient.invalidateQueries({ queryKey: QK.documents.clientSignals(variables.client_id) }),
      ]);
    },
  });

  const submitUpload = async (
    payload: Pick<UploadDocumentPayload, "document_type" | "file">,
  ): Promise<boolean> => {
    if (!clientId) {
      setUploadError("יש לבחור לקוח לפני העלאה");
      return false;
    }
    try {
      setUploadError(null);
      await uploadMutation.mutateAsync({ client_id: clientId, ...payload });
      return true;
    } catch (err: unknown) {
      setUploadError(getErrorMessage(err, "שגיאה בהעלאת מסמך"));
      return false;
    }
  };

  return {
    submitUpload,
    uploadError,
    uploading: uploadMutation.isPending,
  };
};
