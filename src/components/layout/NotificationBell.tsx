import { Bell } from "lucide-react";
import { NotificationDrawer } from "../../features/notifications/components/NotificationDrawer";
import { useNotificationBell } from "../../features/notifications/hooks/useNotificationBell";

export const NotificationBell: React.FC = () => {
  const { drawerOpen, unreadCount, handleOpen, handleClose } =
    useNotificationBell();

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
