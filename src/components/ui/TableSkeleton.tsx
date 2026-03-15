import { Card } from "./Card";
import { SkeletonBlock } from "./SkeletonBlock";
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
}) => (
  <Card className={className} variant="elevated">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-gray-100">
          <tr>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <th key={colIndex} className="pb-4 pe-4 text-right">
                <SkeletonBlock shimmer width="w-24" height="h-4" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="group hover:bg-gray-50/50 transition-colors">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="py-4 pe-4">
                  <SkeletonBlock
                    shimmer
                    width={colIndex === 0 ? "w-32" : colIndex === columns - 1 ? "w-20" : "w-24"}
                    height="h-4"
                    delay={staggerDelay(rowIndex)}
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
