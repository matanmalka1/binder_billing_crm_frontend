export const remindersQK = {
  all: ['reminders'] as const,
  list: (
    clientId?: number,
    status?: string,
    page?: number,
    pageSize?: number,
    due?: string | null,
    source?: string | null,
  ) =>
    [
      'reminders',
      'list',
      clientId ?? 'all',
      status ?? 'pending',
      due ?? null,
      source ?? 'all',
      { page, page_size: pageSize },
    ] as const,
  count: (clientId?: number, status?: string, source?: string | null) =>
    ['reminders', 'count', clientId ?? 'all', status ?? 'pending', source ?? 'all'] as const,
} as const
