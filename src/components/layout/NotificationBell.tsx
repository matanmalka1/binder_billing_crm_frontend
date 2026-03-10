import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { notificationsApi } from "../../api/notifications.api";
import { QK } from "../../lib/queryKeys";
import { NotificationDrawer } from "../../features/notifications/components/NotificationDrawer";

export const NotificationBell: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data } = useQuery({
    queryKey: QK.notifications.unreadCount(),
    queryFn: () => notificationsApi.getUnreadCount(),
    refetchInterval: 30_000,
  });

  const unreadCount = data?.unread_count ?? 0;

  const handleOpen = () => setDrawerOpen(true);
  const handleClose = () => setDrawerOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="relative p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        aria-label="התראות"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
      <NotificationDrawer open={drawerOpen} onClose={handleClose} />
    </>
  );
};
NotificationBell.displayName = "NotificationBell";
