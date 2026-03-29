import { RotateCcw } from "lucide-react";
import { Badge } from "../primitives/Badge";
import { Button } from "../primitives/Button";

export interface FilterBadge {
  key: string;
  label: string;
  onRemove: () => void;
}

interface Props {
  badges: FilterBadge[];
  onReset: () => void;
}

export const ActiveFilterBadges: React.FC<Props> = ({ badges, onReset }) => {
  if (badges.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 animate-fade-in">
      {badges.map((b) => (
        <Badge key={b.key} removable onRemove={b.onRemove}>
          {b.label}
        </Badge>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        איפוס
      </Button>
    </div>
  );
};
