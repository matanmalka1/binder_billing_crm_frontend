import { useState } from "react";
import { cn } from "../../../utils/utils";
import { useNotifications } from "../hooks/useNotifications";
import { useRole } from "../../../hooks/useRole";
import { SeverityBadge } from "./SeverityBadge";
import { SendNotificationModal } from "./SendNotificationModal";
import type { NotificationItem } from "../api";
import type { NotificationDrawerProps } from "../types";

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ open, onClose }) => {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const { isAdvisor } = useRole();
  const [sendOpen, setSendOpen] = useState(false);
  const limited = notifications.slice(0, 20);

  const handleItemClick = (item: NotificationItem) => {
    if (!item.is_read) {
      markRead([item.id]);
    }
  };

  const handleMarkAllRead = () => {
    markAllRead();
  };

  return (
    <>
      <SendNotificationModal
        open={sendOpen}
        onClose={() => setSendOpen(false)}
      />
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/20 transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-2xl",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="התראות"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="text-base font-semibold text-gray-900">התראות</h3>
          <div className="flex items-center gap-3">
            {isAdvisor && (
              <button
                type="button"
                onClick={() => setSendOpen(true)}
                className="text-xs text-green-600 hover:text-green-700 font-medium"
              >
                שלח הודעה
              </button>
            )}
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="text-xs text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed font-medium"
            >
              סמן הכל כנקרא
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="סגירה"
            >
              ✕
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {limited.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-gray-400">אין התראות</p>
          )}
          {limited.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item)}
              className={cn(
                "w-full text-right px-5 py-4 flex flex-col gap-1 hover:bg-gray-50 transition-colors",
                !item.is_read && "bg-blue-50 hover:bg-blue-100",
              )}
            >
              <div className="flex items-center gap-2">
                <SeverityBadge severity={item.severity} />
                {!item.is_read && (
                  <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" aria-label="לא נקרא" />
                )}
              </div>
              {item.business_name && (
                <span className="text-xs font-medium text-gray-600">{item.business_name}</span>
              )}
              <p className="text-sm text-gray-800 leading-snug">{item.content_snapshot}</p>
              {item.recipient && (
                <span className="text-xs text-gray-500">נשלח ל: {item.recipient}</span>
              )}
              <span className="text-xs text-gray-400">
                {new Date(item.created_at).toLocaleDateString("he-IL", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
NotificationDrawer.displayName = "NotificationDrawer";
