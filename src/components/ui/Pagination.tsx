import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { usePagination } from "../../hooks/usePagination";
import { Select } from "./Select";
import { cn } from "../../utils/utils";

interface PaginationProps {
  currentPage: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  showPageSizeSelect?: boolean;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  total,
  pageSize,
  onPageChange,
  showPageSizeSelect = false,
  pageSizeOptions = [20, 50, 100],
  onPageSizeChange,
}) => {
  const { pageNumbers, hasNext, hasPrevious } = usePagination({
    total: total,
    pageSize,
    currentPage,
  });

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border border-gray-200 rounded-lg p-3 bg-white">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>סה\"כ</span>
        <span className="font-semibold text-gray-900">{total.toLocaleString("he-IL")}</span>
        <span>פריטים</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm",
            hasPrevious
              ? "border-gray-300 text-gray-700 hover:bg-gray-50"
              : "border-gray-200 text-gray-400 cursor-not-allowed",
          )}
          onClick={() => hasPrevious && onPageChange(currentPage - 1)}
          disabled={!hasPrevious}
        >
          <ChevronRight className="h-4 w-4" />
          הקודם
        </button>

        {pageNumbers.map((page, idx) =>
          page === "ellipsis" ? (
            <MoreHorizontal key={`ellipsis-${idx}`} className="h-4 w-4 text-gray-400" />
          ) : (
            <button
              key={page}
              type="button"
              className={cn(
                "min-w-[2.5rem] rounded-md border px-3 py-1 text-sm transition-colors",
                page === currentPage
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50",
              )}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm",
            hasNext
              ? "border-gray-300 text-gray-700 hover:bg-gray-50"
              : "border-gray-200 text-gray-400 cursor-not-allowed",
          )}
          onClick={() => hasNext && onPageChange(currentPage + 1)}
          disabled={!hasNext}
        >
          הבא
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {showPageSizeSelect && (
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span>גודל עמוד:</span>
          <Select
            value={String(pageSize)}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            options={pageSizeOptions.map((option) => ({
              value: String(option),
              label: option.toString(),
            }))}
            className="w-24"
          />
        </div>
      )}
    </div>
  );
};
