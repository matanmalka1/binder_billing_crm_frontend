import { Card } from "./Card";
import { Select } from "./Select";

interface PaginationCardProps {
  page: number;
  totalPages: number;
  total: number;
  label?: string;
  onPageChange: (nextPage: number) => void;
  showPageSizeSelect?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
}

export const PaginationCard: React.FC<PaginationCardProps> = ({
  page,
  totalPages,
  total,
  label = "תוצאות",
  onPageChange,
  showPageSizeSelect = false,
  pageSize,
  pageSizeOptions = [20, 50, 100],
  onPageSizeChange,
}) => {
  return (
    <Card>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-sm">
        <p className="text-gray-600">
          עמוד {page} מתוך {totalPages} ({total.toLocaleString("he-IL")} {label})
        </p>
        <div className="flex items-center gap-2">
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

      {showPageSizeSelect &&
        pageSize !== undefined &&
        typeof onPageSizeChange === "function" && (
          <div className="mt-2 flex flex-col gap-1 text-sm text-gray-700">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
              גודל עמוד
            </span>
            <Select
              value={String(pageSize)}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              options={pageSizeOptions.map((option) => ({
                value: String(option),
                label: option.toString(),
              }))}
              className="w-28"
            />
          </div>
        )}
    </Card>
  );
};
