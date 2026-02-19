import { Card } from "./Card";
import { Button } from "./Button";
import type { LucideIcon } from "lucide-react";

export interface EmptyStateProps {
  icon: LucideIcon;
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  message,
  action,
  className,
}) => {
  return (
    <Card className={className}>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        {/* Icon */}
        <div className="mb-4 rounded-full bg-gray-100 p-4">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>

        {/* Title (optional) */}
        {title && (
          <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
        )}

        {/* Message */}
        <p className="mb-6 max-w-md text-sm text-gray-600">{message}</p>

        {/* Optional Action */}
        {action && (
          <Button onClick={action.onClick} variant="primary">
            {action.label}
          </Button>
        )}
      </div>
    </Card>
  );
};
