import { Card } from "./Card";
import { cn } from "../../utils/utils";
import { staggerDelay } from "../../utils/animation";

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
    <Card className={className} variant="elevated">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header Skeleton */}
          <thead className="border-b border-gray-100">
            <tr>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <th key={colIndex} className="pb-4 pr-4 text-right">
                  <div
                    className="relative h-4 w-24 overflow-hidden rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"
                    style={{ backgroundSize: "1000px 100%" }}
                  />
                </th>
              ))}
            </tr>
          </thead>

          {/* Body Skeleton */}
          <tbody className="divide-y divide-gray-50">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="group hover:bg-gray-50/50 transition-colors">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="py-4 pr-4">
                    <div
                      className={cn(
                        "relative h-4 overflow-hidden rounded-md bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-shimmer",
                        // Vary widths for more realistic skeleton
                        colIndex === 0 ? "w-32" : 
                        colIndex === columns - 1 ? "w-20" : 
                        "w-24"
                      )}
                      style={{
                        backgroundSize: "1000px 100%",
                        animationDelay: staggerDelay(rowIndex),
                      }}
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
