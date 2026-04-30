import { Card } from '../primitives/Card'

interface PaginationCardProps {
  page: number
  totalPages: number
  total: number
  label?: string
  onPageChange: (nextPage: number) => void
}

export const PaginationCard: React.FC<PaginationCardProps> = ({
  page,
  totalPages,
  total,
  label = 'תוצאות',
  onPageChange,
}) => {
  return (
    <Card>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-sm">
        <p className="text-gray-600">
          עמוד {page} מתוך {totalPages} ({total.toLocaleString('he-IL')} {label})
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-md border border-gray-300 px-3 py-1 text-gray-700 disabled:opacity-50"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-disabled={page <= 1}
            aria-label="עמוד קודם"
          >
            הקודם
          </button>
          <button
            type="button"
            className="rounded-md border border-gray-300 px-3 py-1 text-gray-700 disabled:opacity-50"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-disabled={page >= totalPages}
            aria-label="עמוד הבא"
          >
            הבא
          </button>
        </div>
      </div>
    </Card>
  )
}
