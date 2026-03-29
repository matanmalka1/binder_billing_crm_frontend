import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi, notificationsQK } from "../api";
import type { SendNotificationPayload } from "../api";
import { toast } from "../../../utils/toast";
import { getErrorMessage } from "../../../utils/utils";

export const useSendNotification = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: SendNotificationPayload) => notificationsApi.send(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationsQK.all });
      toast.success("ההודעה נשלחה בהצלחה");
      onSuccess?.();
    },
    onError: (err) => toast.error(getErrorMessage(err, "שגיאה בשליחת ההודעה")),
  });

  return {
    sendNotification: mutation.mutate,
    isSending: mutation.isPending,
  };
};
