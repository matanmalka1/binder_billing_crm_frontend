import { DataTable } from '../../../components/ui/table/DataTable'
import type { AdvancePaymentRow } from '../types'
import { buildAdvancePaymentColumns } from './AdvancePaymentColumns'
import { CalendarDays } from 'lucide-react'

interface AdvancePaymentTableProps {
  rows: AdvancePaymentRow[]
  isLoading: boolean
  showBusinessName?: boolean
  canEdit?: boolean
  onRowClick?: (row: AdvancePaymentRow) => void
  onDelete?: (id: number) => void
  deletingId?: number | null
}

export const AdvancePaymentTable: React.FC<AdvancePaymentTableProps> = ({
  rows,
  isLoading,
  showBusinessName = false,
  canEdit = false,
  onRowClick,
  onDelete,
  deletingId = null,
}) => (
  <DataTable
    data={rows}
    columns={buildAdvancePaymentColumns({ canEdit, showBusinessName, deletingId, onDelete })}
    getRowKey={(row) => row.id}
    isLoading={isLoading}
    onRowClick={onRowClick}
    emptyState={{
      icon: CalendarDays,
      title: 'אין מקדמות לשנה זו',
      message: 'לא נמצאו רשומות מקדמות לשנה הנבחרת',
    }}
  />
)
