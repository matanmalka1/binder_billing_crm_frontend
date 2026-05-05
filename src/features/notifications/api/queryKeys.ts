export const notificationsQK = {
  all: ['notifications'] as const,
  list: (params?: object) => ['notifications', 'list', params ?? {}] as const,
  unreadCount: (clientId?: number) => ['notifications', 'unread-count', clientId ?? 'global'] as const,
} as const
