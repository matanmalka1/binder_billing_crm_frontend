import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "../api";
import { QK } from "../../../lib/queryKeys";
import { toast } from "../../../utils/toast";
import { getErrorMessage } from "../../../utils/utils";

export const useNotifications = (clientId?: number) => {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: QK.notifications.list(
      clientId != null ? { client_id: clientId } : {},
    ),
    queryFn: () =>
      notificationsApi.list(
        clientId != null ? { client_id: clientId } : undefined,
      ),
  });

  const { data: unreadData } = useQuery({
    queryKey: QK.notifications.unreadCount(clientId),
    queryFn: () => notificationsApi.getUnreadCount(clientId),
  });

  const unreadCount = unreadData?.unread_count ?? 0;

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: QK.notifications.all });
  };

  const markReadMutation = useMutation({
    mutationFn: (ids: number[]) => notificationsApi.markRead(ids),
    onSuccess: invalidate,
    onError: (err) =>
      toast.error(getErrorMessage(err, "שגיאה בסימון התראה כנקראה")),
  });

  const markAllReadMutation = useMutation({
    mutationFn: (cid?: number) => notificationsApi.markAllRead(cid),
    onSuccess: invalidate,
    onError: (err) =>
      toast.error(getErrorMessage(err, "שגיאה בסימון כל ההתראות כנקראות")),
  });

  const markRead = (ids: number[]) => markReadMutation.mutate(ids);
  const markAllRead = (cid?: number) => markAllReadMutation.mutate(cid);

  return { notifications, unreadCount, markRead, markAllRead, isLoading };
};
