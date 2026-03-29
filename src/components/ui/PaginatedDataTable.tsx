import type { ReactNode } from "react";
import { Alert } from "./Alert";
import { DataTable, type DataTableProps } from "./DataTable";
import { getTotalPages } from "../../utils/paginationUtils";
import { PaginationCard } from "./PaginationCard";

const DEFAULT_PAGE_SIZE_OPTIONS = [20, 50, 100];

type BasePaginatedDataTableProps<T> = Pick<
  DataTableProps<T>,
  | "className"
  | "columns"
  | "data"
  | "emptyMessage"
  | "emptyState"
  | "getRowKey"
  | "onRowClick"
  | "rowClassName"
>;

export interface PaginatedDataTableProps<T> extends BasePaginatedDataTableProps<T> {
  error?: string | null;
  isLoading?: boolean;
  label?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  page: number;
  pageSize: number;
  pageSizeOptions?: number[];
  showPagination?: boolean;
  summary?: ReactNode;
  total: number;
}

export const PaginatedDataTable = <T,>({
  className,
  columns,
  data,
  emptyMessage,
  emptyState,
  error,
  getRowKey,
  isLoading = false,
  label,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  page,
  pageSize,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  rowClassName,
  showPagination,
  summary,
  total,
}: PaginatedDataTableProps<T>) => {
  const shouldShowPagination = showPagination ?? (!isLoading && total > 0 && data.length > 0);

  return (
    <>
      {error && <Alert variant="error" message={error} />}
      {summary}
      <DataTable
        data={data}
        columns={columns}
        getRowKey={getRowKey}
        onRowClick={onRowClick}
        className={className}
        emptyMessage={emptyMessage}
        isLoading={isLoading}
        rowClassName={rowClassName}
        emptyState={emptyState}
      />
      {shouldShowPagination && (
        <PaginationCard
          page={page}
          totalPages={getTotalPages(total, pageSize)}
          total={total}
          label={label}
          onPageChange={onPageChange}
          showPageSizeSelect
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </>
  );
};
