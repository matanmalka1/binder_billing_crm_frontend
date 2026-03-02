import { RotateCcw } from "lucide-react";
import { cn } from "../../utils/utils";
import { Card } from "./Card";

export interface ErrorCardProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ message, onRetry, className }) => {
  return (
    <Card className={cn("border-red-200 bg-red-50", className)}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-red-600">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="flex shrink-0 items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            נסה שנית
          </button>
        )}
      </div>
    </Card>
  );
};
