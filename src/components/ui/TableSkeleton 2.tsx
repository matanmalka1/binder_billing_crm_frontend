import { Card } from "./Card";
import { cn } from "../../utils/utils";

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 6,
  className,
}) => {
  return (
    <Card className={className}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header Skeleton */}
          <thead className="border-b border-gray-200">
            <tr className="text-right">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <th key={colIndex} className="pb-3 pr-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                </th>
              ))}
            </tr>
          </thead>

          {/* Body Skeleton */}
          <tbody className="divide-y divide-gray-100">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="py-3 pr-4">
                    <div
                      className={cn(
                        "h-4 animate-pulse rounded bg-gray-100",
                        // Vary widths for more realistic skeleton
                        colIndex === 0
                          ? "w-32"
                          : colIndex === columns - 1
                            ? "w-20"
                            : "w-24",
                      )}
                    />
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
