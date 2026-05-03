import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { he } from 'date-fns/locale'
import { DataTable } from '@/components/ui/table/DataTable'
import { Badge } from '@/components/ui/primitives/Badge'
import type { UnifiedItem } from '../api/contracts'
import { taskTypeLabels, taskUrgencyLabels, taskUrgencyVariant } from '../constants'

interface TasksTableProps {
  items: UnifiedItem[]
  isLoading?: boolean
}

const typeLabel = (sourceType: string): string =>
  taskTypeLabels[sourceType as keyof typeof taskTypeLabels] ?? sourceType

const formatDueDate = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: he })
  } catch {
    return dateStr
  }
}

export const TasksTable: React.FC<TasksTableProps> = ({ items, isLoading }) => {
  const columns = [
    {
      key: 'label',
      header: 'משימה',
      render: (item: UnifiedItem) => (
        <span className="font-medium text-gray-900">{item.label}</span>
      ),
    },
    {
      key: 'type',
      header: 'סוג',
      render: (item: UnifiedItem) => (
        <span className="text-sm text-gray-600">{typeLabel(item.source_type)}</span>
      ),
    },
    {
      key: 'due_date',
      header: 'תאריך יעד',
      render: (item: UnifiedItem) => (
        <span className="text-sm tabular-nums text-gray-700">{formatDueDate(item.due_date)}</span>
      ),
    },
    {
      key: 'urgency',
      header: 'דחיפות',
      render: (item: UnifiedItem) => {
        const urgency = item.urgency ?? 'upcoming'
        return (
          <Badge variant={taskUrgencyVariant[urgency as keyof typeof taskUrgencyVariant] ?? 'neutral'}>
            {taskUrgencyLabels[urgency as keyof typeof taskUrgencyLabels] ?? urgency}
          </Badge>
        )
      },
    },
    {
      key: 'client',
      header: 'לקוח',
      render: (item: UnifiedItem) =>
        item.client_record_id != null ? (
          <Link
            to={`/clients/${item.client_record_id}`}
            className="text-sm text-primary-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            לפרופיל לקוח
          </Link>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        ),
    },
  ]

  return (
    <DataTable
      data={items}
      columns={columns}
      getRowKey={(item) => `${item.source_type}-${item.source_id}`}
      isLoading={isLoading}
      emptyMessage="אין משימות להצגה"
    />
  )
}
