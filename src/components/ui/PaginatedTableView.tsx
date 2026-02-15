import { ErrorCard } from "./ErrorCard";
import { EmptyState } from "./EmptyState";
import { TableSkeleton } from "./TableSkeleton";
import { PaginationCard } from "./PaginationCard";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export interface PaginatedTableViewProps<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  renderTable: (data: T[]) => React.ReactNode;
  emptyState?: {
    icon?: LucideIcon;
    title?: string;
    message?: string;
  };
  skeletonRows?: number;
  skeletonColumns?: number;
}

export const PaginatedTableView = <T,>({
  data,
  loading,
  error,
  pagination,
  renderTable,
  emptyState,
  skeletonRows = 5,
  skeletonColumns = 6,
}: PaginatedTableViewProps<T>) => {
  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.pageSize));

  // Loading State
  if (loading) {
    return <TableSkeleton rows={skeletonRows} columns={skeletonColumns} />;
  }

  // Error State
  if (error) {
    return <ErrorCard message={error} />;
  }

  // Empty State
  if (data.length === 0) {
    return (
      <EmptyState
        icon={emptyState?.icon || Inbox}
        title={emptyState?.title}
        message={emptyState?.message || "אין נתונים להצגה"}
      />
    );
  }

  // Data State
  return (
    <div className="space-y-6">
      {renderTable(data)}

      {/* Always show pagination if there's data */}
      {totalPages > 0 && (
        <PaginationCard
          page={pagination.page}
          totalPages={totalPages}
          total={pagination.total}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
};
