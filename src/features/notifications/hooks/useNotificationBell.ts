import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { notificationsApi, notificationsQK } from '../api'

export const useNotificationBell = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const { data } = useQuery({
    queryKey: notificationsQK.unreadCount(),
    queryFn: () => notificationsApi.getUnreadCount(),
    refetchInterval: 30_000,
  })

  const unreadCount = data?.unread_count ?? 0
  const handleOpen = () => setDrawerOpen(true)
  const handleClose = () => setDrawerOpen(false)

  return { drawerOpen, unreadCount, handleOpen, handleClose }
}
