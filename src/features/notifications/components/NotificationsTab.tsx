import { useNotifications } from "../hooks/useNotifications";
import { SeverityBadge } from "./SeverityBadge";
import { Button } from "../../../components/ui/Button";
import type { NotificationsTabProps } from "../types";

export const NotificationsTab: React.FC<NotificationsTabProps> = ({ clientId }) => {
  const { notifications, unreadCount, markAllRead, isLoading } = useNotifications(clientId);
  const limited = notifications.slice(0, 50);

  const handleMarkAllRead = () => markAllRead(clientId);

  if (isLoading) {
    return <p className="text-sm text-gray-400 py-8 text-center">טוען התראות...</p>;
  }

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">התראות לקוח</h3>
        <Button
          type="button"
          variant="outline"
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
        >
          סמן הכל כנקרא
        </Button>
      </div>

      {limited.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">אין התראות ללקוח זה</p>
      ) : (
        <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 overflow-hidden">
          {limited.map((item) => (
            <li
              key={item.id}
              className={`px-4 py-3 flex flex-col gap-1 ${!item.is_read ? "bg-blue-50" : "bg-white"}`}
            >
              <div className="flex items-center gap-2">
                <SeverityBadge severity={item.severity} />
                {!item.is_read && (
                  <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" aria-label="לא נקרא" />
                )}
              </div>
              <p className="text-sm text-gray-800">{item.content_snapshot}</p>
              <span className="text-xs text-gray-400">
                {new Date(item.created_at).toLocaleDateString("he-IL")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
NotificationsTab.displayName = "NotificationsTab";
