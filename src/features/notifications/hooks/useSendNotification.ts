import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "../../../api/notifications.api";
import type { SendNotificationPayload } from "../../../api/notifications.api";
import { QK } from "../../../lib/queryKeys";
import { toast } from "../../../utils/toast";
import { getErrorMessage } from "../../../utils/utils";

export const useSendNotification = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: SendNotificationPayload) => notificationsApi.send(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QK.notifications.all });
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
