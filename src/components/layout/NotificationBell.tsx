import { Bell } from 'lucide-react'
import { NotificationDrawer, useNotificationBell } from '../../features/notifications'

export const NotificationBell: React.FC = () => {
  const { drawerOpen, unreadCount, handleOpen, handleClose } = useNotificationBell()

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
          <span
            role="status"
            aria-label={`${unreadCount > 99 ? '99+' : unreadCount} התראות חדשות`}
            className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-negative-500 text-[10px] font-bold text-white leading-none"
          >
            <span aria-hidden="true">{unreadCount > 99 ? '99+' : unreadCount}</span>
          </span>
        )}
      </button>
      <NotificationDrawer open={drawerOpen} onClose={handleClose} />
    </>
  )
}
NotificationBell.displayName = 'NotificationBell'
