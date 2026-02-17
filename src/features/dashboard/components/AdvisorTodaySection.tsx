import type { LucideIcon } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import { cn } from "../../../utils/utils";

export interface SectionItem {
  id: number;
  label: string;
  sublabel?: string;
}

interface Props {
  icon: LucideIcon;
  title: string;
  items: SectionItem[];
  badgeVariant?: "warning" | "error" | "info" | "neutral";
  emptyLabel: string;
}

export const AdvisorTodaySection: React.FC<Props> = ({
  icon: Icon,
  title,
  items,
  badgeVariant = "warning",
  emptyLabel,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-800">{title}</span>
        </div>
        <Badge variant={items.length > 0 ? badgeVariant : "neutral"}>
          {items.length}
        </Badge>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-gray-400 pr-6">{emptyLabel}</p>
      ) : (
        <ul className="space-y-1 pr-6 max-h-32 overflow-y-auto">
          {items.slice(0, 5).map((item) => (
            <li
              key={item.id}
              className={cn(
                "text-xs rounded-lg border border-gray-100 bg-gray-50 px-3 py-2",
              )}
            >
              <p className="font-medium text-gray-800 truncate">{item.label}</p>
              {item.sublabel && (
                <p className="text-gray-500 truncate">{item.sublabel}</p>
              )}
            </li>
          ))}
          {items.length > 5 && (
            <li className="text-xs text-gray-400 text-center py-1">
              ועוד {items.length - 5}...
            </li>
          )}
        </ul>
      )}
    </div>
  );
};
