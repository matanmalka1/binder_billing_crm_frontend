import { createQueryKeys } from '@/lib/queryKeys'

export const taxDeadlinesQK = {
  ...createQueryKeys(['tax', 'deadlines'] as const),
  timeline: (clientId: number) => ['tax-deadlines', 'timeline', clientId] as const,
}
