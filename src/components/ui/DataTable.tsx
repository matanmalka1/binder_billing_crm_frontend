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
  getRowKey: (item: T) => string | number;
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
    <Card className={cn("overflow-hidden p-0", className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-right">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500",
                    column.headerClassName,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {data.map((item, index) => (
              <tr
                key={getRowKey(item)}
                className={cn(
                  "transition-colors duration-100",
                  onRowClick && "cursor-pointer hover:bg-blue-50/40 active:bg-blue-50/70",
                  !onRowClick && "hover:bg-gray-50/60",
                  rowClassName?.(item, index),
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn("px-4 py-3.5 align-middle", column.className)}
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
