import { Badge } from "../primitives/Badge";

export interface FilterBadge {
  key: string;
  label: string;
  onRemove: () => void;
}

interface Props {
  badges: FilterBadge[];
  onReset?: () => void;
}

export const ActiveFilterBadges: React.FC<Props> = ({ badges }) => {
  if (badges.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 animate-fade-in">
      {badges.map((b) => (
        <Badge key={b.key} removable onRemove={b.onRemove}>
          {b.label}
        </Badge>
      ))}
    </div>
  );
};
