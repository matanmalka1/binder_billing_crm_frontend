import { api } from '@/api/client'
import { TASK_ENDPOINTS } from './endpoints'
import {
  deadlineTaskSchema,
  unifiedItemSchema,
  type DeadlineTask,
  type TasksParams,
  type UnifiedItem,
} from './contracts'

export const tasksApi = {
  list: async (params?: TasksParams): Promise<DeadlineTask[]> => {
    const response = await api.get<DeadlineTask[]>(TASK_ENDPOINTS.tasks, { params })
    return deadlineTaskSchema.array().parse(response.data)
  },

  unified: async (params?: TasksParams): Promise<UnifiedItem[]> => {
    const response = await api.get<UnifiedItem[]>(TASK_ENDPOINTS.unified, { params })
    return unifiedItemSchema.array().parse(response.data)
  },
}
