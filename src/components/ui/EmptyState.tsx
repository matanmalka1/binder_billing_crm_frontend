import { Card } from "./Card";
import { Button } from "./Button";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../utils/utils";

export interface EmptyStateProps {
  icon: LucideIcon;
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "illustration" | "minimal";
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  message,
  action,
  variant = "default",
  className,
}) => {
  return (
    <Card className={cn("border-dashed", className)} variant="elevated">
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        {/* Animated Icon Container */}
        <div 
          className={cn(
            "relative mb-6 animate-scale-in",
            variant === "illustration" && "mb-8"
          )}
        >
          {/* Decorative background circles */}
          {variant === "illustration" && (
            <>
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary-100 rounded-full opacity-40 animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-primary-200 rounded-full opacity-60" />
              </div>
            </>
          )}

          {/* Icon */}
          <div
            className={cn(
              "relative rounded-2xl p-5 transition-transform duration-300 hover:scale-110",
              variant === "illustration" 
                ? "bg-gradient-to-br from-primary-100 to-accent-100 shadow-lg"
                : "bg-gray-100"
            )}
          >
            <Icon 
              className={cn(
                "transition-colors duration-300",
                variant === "illustration"
                  ? "h-12 w-12 text-primary-600"
                  : "h-10 w-10 text-gray-400"
              )} 
            />
          </div>
        </div>

        {/* Title */}
        {title && (
          <h3 className="mb-3 text-xl font-semibold text-gray-900">
            {title}
          </h3>
        )}

        {/* Message */}
        <p className="mb-6 max-w-md text-base text-gray-600 leading-relaxed">
          {message}
        </p>

        {/* Optional Action */}
        {action && (
        <Button 
            onClick={action.onClick} 
            variant="primary"
          >
            {action.label}
          </Button>
        )}
      </div>
    </Card>
  );
};
