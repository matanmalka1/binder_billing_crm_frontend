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
        queryClient.invalidateQueries({ queryKey: documentsQK.businessList(variables.business_id) }),
        queryClient.invalidateQueries({ queryKey: documentsQK.businessSignals(variables.business_id) }),
      ]);
    },
  });

  const submitUpload = async (
    payload: Pick<UploadDocumentPayload, "document_type" | "file"> & { tax_year?: number | null },
  ): Promise<boolean> => {
    if (!businessId) {
      setUploadError("יש לבחור לקוח לפני העלאה");
      return false;
    }
    try {
      await uploadMutation.mutateAsync({ business_id: businessId, ...payload });
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
