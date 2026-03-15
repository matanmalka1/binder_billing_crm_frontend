import { Card } from "./Card";
import { Button } from "./Button";
import { SectionHeader } from "./SectionHeader";
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
}) => (
  <Card className={className}>
    <div className="mb-4">
      <SectionHeader
        title={title}
        size="sm"
        border="bottom"
        actions={
          onReset ? (
            <Button type="button" variant="ghost" onClick={onReset} className="gap-1 text-sm">
              <X className="h-4 w-4" />
              איפוס
            </Button>
          ) : undefined
        }
      />
    </div>
    <div>{children}</div>
  </Card>
);
