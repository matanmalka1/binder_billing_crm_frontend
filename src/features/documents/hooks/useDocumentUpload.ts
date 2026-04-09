import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { documentsApi, documentsQK, type UploadDocumentPayload } from "../api";
import { getErrorMessage } from "../../../utils/utils";
import { toast } from "../../../utils/toast";

export const useDocumentUpload = (businessId: number) => {
  const queryClient = useQueryClient();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: (payload: UploadDocumentPayload) => documentsApi.upload(payload),
    onSuccess: async (_, variables) => {
      setUploadError(null);
      toast.success("מסמך הועלה בהצלחה");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: documentsQK.clientList(variables.client_id) }),
        queryClient.invalidateQueries({ queryKey: documentsQK.clientSignals(variables.client_id) }),
      ]);
    },
  });

  const submitUpload = async (
    payload: Pick<UploadDocumentPayload, "client_id" | "document_type" | "file"> & {
      tax_year?: number | null;
      notes?: string | null;
      annual_report_id?: number | null;
    },
  ): Promise<boolean> => {
    if (!businessId) {
      setUploadError("יש להגדיר עסק פעיל לפני העלאה");
      return false;
    }
    try {
      await uploadMutation.mutateAsync({ business_id: businessId, client_id: payload.client_id, ...payload });
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
