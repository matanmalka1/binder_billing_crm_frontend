import type { ReactNode } from "react";
import { Card } from "./Card";
import { cn } from "../../utils/utils";
import { EmptyState, type EmptyStateProps } from "./EmptyState";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { TableSkeleton } from "./TableSkeleton";

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowKey: (item: T, index: number) => string | number;
  onRowClick?: (item: T) => void;
  className?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  rowClassName?: (item: T, index: number) => string;
  emptyState?: Omit<EmptyStateProps, "icon" | "message"> & {
    icon?: LucideIcon;
    message?: string;
  };
}

export const DataTable = <T,>({
  data,
  columns,
  getRowKey,
  onRowClick,
  className,
  emptyMessage = "אין נתונים להצגה",
  isLoading = false,
  rowClassName,
  emptyState,
}: DataTableProps<T>) => {
  if (isLoading) {
    return (
      <TableSkeleton
        rows={5}
        columns={Math.max(columns.length, 1)}
        className={className}
      />
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={emptyState?.icon ?? Inbox}
        title={emptyState?.title}
        message={emptyState?.message ?? emptyMessage}
        action={emptyState?.action}
        variant={emptyState?.variant}
        className={cn(className, emptyState?.className)}
      />
    );
  }

  return (
    <Card className={className}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr className="text-right">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "pb-3 pr-4 font-semibold text-gray-700",
                    column.headerClassName,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item, index) => (
              <tr
                key={getRowKey(item, index)}
                className={cn(
                  "transition-colors",
                  onRowClick && "cursor-pointer hover:bg-gray-50 active:bg-gray-100",
                  !onRowClick && "hover:bg-gray-50",
                  rowClassName?.(item, index),
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn("py-3 pr-4", column.className)}
                  >
                    {column.render(item, index)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
