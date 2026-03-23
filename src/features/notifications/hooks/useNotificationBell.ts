import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "../api";
import { QK } from "../../../lib/queryKeys";

export const useNotificationBell = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data } = useQuery({
    queryKey: QK.notifications.unreadCount(),
    queryFn: () => notificationsApi.getUnreadCount(),
    refetchInterval: 30_000,
  });

  const unreadCount = data?.unread_count ?? 0;
  const handleOpen = () => setDrawerOpen(true);
  const handleClose = () => setDrawerOpen(false);

  return { drawerOpen, unreadCount, handleOpen, handleClose };
};
