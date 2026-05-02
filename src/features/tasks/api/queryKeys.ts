import type { TasksParams } from './contracts'

const normalizeParams = (params?: TasksParams) => ({
  client_record_id: params?.client_record_id ?? 'all',
  business_id: params?.business_id ?? 'all',
})

export const tasksQK = {
  all: ['tasks'] as const,
  list: (params?: TasksParams) => ['tasks', 'list', normalizeParams(params)] as const,
  unified: (params?: TasksParams) => ['tasks', 'unified', normalizeParams(params)] as const,
} as const
