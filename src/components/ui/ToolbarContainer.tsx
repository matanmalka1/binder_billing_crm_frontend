import { cn } from "../../utils/utils";
import { Card } from "./Card";
import { Button } from "./Button";
import { X } from "lucide-react";

interface ToolbarContainerProps {
  children: React.ReactNode;
  title?: string;
  onReset?: () => void;
  /** When true, wraps in a Card (FilterBar mode). When false, uses bare border (InlineToolbar mode). */
  elevated?: boolean;
  className?: string;
}

export const ToolbarContainer: React.FC<ToolbarContainerProps> = ({
  children,
  title,
  onReset,
  elevated = false,
  className,
}) => {
  if (elevated) {
    return (
      <Card className={className}>
        {title && (
          <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {onReset && (
              <Button type="button" variant="ghost" onClick={onReset} className="gap-1 text-sm">
                <X className="h-4 w-4" />
                איפוס
              </Button>
            )}
          </div>
        )}
        <div>{children}</div>
      </Card>
    );
  }

  return (
    <div className={cn("rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3", className)}>
      {children}
    </div>
  );
};

ToolbarContainer.displayName = "ToolbarContainer";
