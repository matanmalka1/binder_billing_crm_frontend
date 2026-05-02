import { useQuery } from '@tanstack/react-query'
import { tasksApi, tasksQK, type TasksParams } from '../api'

export const useUnifiedTasks = (params?: TasksParams, enabled = true) =>
  useQuery({
    queryKey: tasksQK.unified(params),
    queryFn: () => tasksApi.unified(params),
    enabled,
  })
