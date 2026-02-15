import { Card } from "./Card";

interface PaginationCardProps {
  page: number;
  totalPages: number;
  total: number;
  label?: string;
  onPageChange: (nextPage: number) => void;
}

export const PaginationCard: React.FC<PaginationCardProps> = ({
  page,
  totalPages,
  total,
  label = "תוצאות",
  onPageChange,
}) => {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="text-gray-600">
          עמוד {page} מתוך {totalPages} ({total} {label})
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md border border-gray-300 px-3 py-1 text-gray-700 disabled:opacity-50"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            הקודם
          </button>
          <button
            type="button"
            className="rounded-md border border-gray-300 px-3 py-1 text-gray-700 disabled:opacity-50"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            הבא
          </button>
        </div>
      </div>
    </Card>
  );
};
