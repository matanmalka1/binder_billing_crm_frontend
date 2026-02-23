import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  signatureRequestsApi,
  type SendSignatureRequestResponse,
} from "../../../api/signatureRequests.api";
import { showErrorToast } from "../../../utils/utils";
import { QK } from "../../../lib/queryKeys";
import { toast } from "../../../utils/toast";

export const usePendingSignatureRequestActions = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: QK.signatureRequests.all });
  };

  const sendMutation = useMutation({
    mutationFn: ({
      id,
      expiryDays,
    }: {
      id: number;
      expiryDays?: number;
    }): Promise<SendSignatureRequestResponse> =>
      signatureRequestsApi.send(id, { expiry_days: expiryDays }),
    onSuccess: () => {
      toast.success("בקשת החתימה נשלחה");
      invalidate();
    },
    onError: (err) => showErrorToast(err, "שגיאה בשליחת בקשת חתימה"),
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      signatureRequestsApi.cancel(id, { reason }),
    onSuccess: () => {
      toast.success("בקשת החתימה בוטלה");
      invalidate();
    },
    onError: (err) => showErrorToast(err, "שגיאה בביטול בקשת חתימה"),
  });

  return {
    send: (id: number, expiryDays?: number) =>
      sendMutation.mutateAsync({ id, expiryDays }),
    isSending: sendMutation.isPending,
    lastSendResult: sendMutation.data,

    cancel: (id: number, reason?: string) =>
      cancelMutation.mutateAsync({ id, reason }),
    isCanceling: cancelMutation.isPending,
  };
};
