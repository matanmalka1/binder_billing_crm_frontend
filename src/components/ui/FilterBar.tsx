import { Card } from "./Card";
import { Button } from "./Button";
import { X } from "lucide-react";

export interface FilterBarProps {
  title?: string;
  onReset?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  title = "סינון",
  onReset,
  children,
  className,
}) => {
  return (
    <Card className={className}>
      {/* Header with optional reset */}
      <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {onReset && (
          <Button
            type="button"
            variant="ghost"
            onClick={onReset}
            className="gap-1 text-sm"
          >
            <X className="h-4 w-4" />
            איפוס
          </Button>
        )}
      </div>

      {/* Filter Content */}
      <div>{children}</div>
    </Card>
  );
};
