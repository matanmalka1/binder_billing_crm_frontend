import { Badge } from "../../../components/ui/Badge";
import { CheckCircle } from "lucide-react";
import type { AttentionItem } from "../../../api/dashboard.api";
import { cn } from "../../../utils/utils";
import { staggerDelay } from "../../../utils/animation";

interface AttentionSectionProps {
  section: {
    key: string;
    title: string;
    icon: React.ElementType;
    types: string[];
    variant: "error" | "warning" | "success" | "neutral";
    color: string;
  };
  items: AttentionItem[];
  sectionIndex: number;
}

export const AttentionSection: React.FC<AttentionSectionProps> = ({
  section,
  items,
  sectionIndex,
}) => {
  const hasItems = items.length > 0;
  const IconComponent = section.icon;

  return (
    <div
      className={cn(
        "group relative rounded-xl border-2 p-4 transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1",
        "animate-scale-in",
        hasItems
          ? `border-${section.color}-200 bg-gradient-to-br from-${section.color}-50 to-transparent`
          : "border-gray-200 bg-gray-50",
      )}
      style={{ animationDelay: staggerDelay(sectionIndex, 100) }}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "rounded-lg p-2 transition-transform group-hover:scale-110",
              hasItems ? `bg-${section.color}-100` : "bg-gray-200",
            )}
          >
            <IconComponent
              className={cn(
                "h-5 w-5",
                hasItems ? `text-${section.color}-600` : "text-gray-500",
              )}
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              {section.title}
            </h4>
            <Badge variant={hasItems ? section.variant : "neutral"} className="mt-1">
              {items.length} פריטים
            </Badge>
          </div>
        </div>
      </div>

      {hasItems ? (
        <ul className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
          {items.map((item, index) => (
            <li
              key={`${section.key}-${item.client_id}-${item.binder_id}-${index}`}
              className={cn(
                "rounded-lg border border-gray-200 bg-white p-3",
                "transition-all duration-200",
                "hover:shadow-md hover:border-gray-300",
                "animate-fade-in",
              )}
              style={{ animationDelay: staggerDelay(index) }}
            >
              <p className="text-sm font-medium text-gray-900 leading-relaxed">
                {item.description || "—"}
              </p>

              <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                {item.client_name && (
                  <>
                    <span className="font-medium">{item.client_name}</span>
                    {(item.client_id || item.binder_id) && (
                      <span className="text-gray-400">•</span>
                    )}
                  </>
                )}
                {item.client_id && (
                  <span className="font-mono">לקוח #{item.client_id}</span>
                )}
                {item.binder_id && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="font-mono">קלסר #{item.binder_id}</span>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-2 rounded-full bg-gray-200 p-3">
            <CheckCircle className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-600">אין פריטים</p>
          <p className="mt-1 text-xs text-gray-500">הכל בסדר גמור</p>
        </div>
      )}

      {hasItems && (
        <div
          className={cn(
            "absolute top-0 left-0 h-1 w-12 rounded-br-lg",
            `bg-gradient-to-r from-${section.color}-500 to-${section.color}-600`,
          )}
        />
      )}
    </div>
  );
};
