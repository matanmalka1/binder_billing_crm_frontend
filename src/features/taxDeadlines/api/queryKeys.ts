import { createQueryKeys } from '@/lib/queryKeys'

export const taxDeadlinesQK = {
  ...createQueryKeys(['tax', 'deadlines'] as const),
  grouped: (params: object) => ['tax-deadlines', 'grouped', params] as const,
  groupClients: (groupKey: string, params: object) =>
    ['tax-deadlines', 'grouped', groupKey, 'clients', params] as const,
}
