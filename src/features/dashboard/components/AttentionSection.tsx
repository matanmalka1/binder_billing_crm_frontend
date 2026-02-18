import { CheckCircle } from "lucide-react";
import type { AttentionItem } from "../../../api/dashboard.api";
import { cn } from "../../../utils/utils";
import { staggerDelay } from "../../../utils/animation";

type Severity = "critical" | "warning" | "success";

interface SectionDef {
  key: string;
  title: string;
  icon: React.ElementType;
  types: readonly string[];
  severity: Severity;
}

interface AttentionSectionProps {
  section: SectionDef;
  items: AttentionItem[];
  sectionIndex: number;
}

/* ── Variant maps ───────────────────────────────────────────────────────── */

const severityHeaderMap: Record<Severity, string> = {
  critical: "bg-red-50 border-r-2 border-r-red-500 rtl:border-r-0 rtl:border-l-2 rtl:border-l-red-500",
  warning:  "bg-amber-50 border-r-2 border-r-amber-400 rtl:border-r-0 rtl:border-l-2 rtl:border-l-amber-400",
  success:  "bg-emerald-50 border-r-2 border-r-emerald-500 rtl:border-r-0 rtl:border-l-2 rtl:border-l-emerald-500",
};

const severityIconMap: Record<Severity, string> = {
  critical: "text-red-600",
  warning:  "text-amber-600",
  success:  "text-emerald-600",
};

const severityCountMap: Record<Severity, string> = {
  critical: "bg-red-100 text-red-700 ring-1 ring-red-200",
  warning:  "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  success:  "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
};

const severityItemMap: Record<Severity, string> = {
  critical: "border-r-2 border-r-red-300 bg-red-50/40 hover:bg-red-50",
  warning:  "border-r-2 border-r-amber-300 bg-amber-50/30 hover:bg-amber-50",
  success:  "border-r-2 border-r-emerald-300 bg-emerald-50/30 hover:bg-emerald-50",
};

/* ── Component ──────────────────────────────────────────────────────────── */

export const AttentionSection = ({ section, items, sectionIndex }: AttentionSectionProps) => {
  const hasItems = items.length > 0;
  const IconComponent = section.icon;

  return (
    <div
      className="flex flex-col animate-fade-in"
      style={{ animationDelay: staggerDelay(sectionIndex, 80) }}
    >
      {/* Section header */}
      <div className={cn(
        "flex items-center justify-between px-5 py-3",
        severityHeaderMap[section.severity]
      )}>
        <div className="flex items-center gap-2">
          <IconComponent className={cn("h-4 w-4 shrink-0", severityIconMap[section.severity])} />
          <span className="text-sm font-semibold text-gray-800">{section.title}</span>
        </div>
        <span className={cn(
          "inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full px-1.5 text-xs font-bold",
          severityCountMap[section.severity]
        )}>
          {items.length}
        </span>
      </div>

      {/* Items */}
      <div className="flex-1 space-y-1.5 overflow-y-auto p-4" style={{ maxHeight: "260px" }}>
        {hasItems ? (
          items.map((item, index) => (
            <div
              key={`${section.key}-${item.client_id}-${item.binder_id}-${index}`}
              className={cn(
                "rounded-lg border border-transparent px-3 py-2.5 transition-colors duration-150",
                "animate-fade-in",
                severityItemMap[section.severity]
              )}
              style={{ animationDelay: staggerDelay(index, 40) }}
            >
              <p className="truncate text-sm font-medium text-gray-800 leading-snug">
                {item.description || "—"}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                {item.client_name && (
                  <span className="font-medium text-gray-600">{item.client_name}</span>
                )}
                {item.client_id && (
                  <span className="font-mono text-gray-400">#{item.client_id}</span>
                )}
                {item.binder_id && (
                  <span className="font-mono text-gray-400">קלסר #{item.binder_id}</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center opacity-50">
            <CheckCircle className="mb-2 h-8 w-8 text-gray-300" />
            <p className="text-xs font-medium text-gray-400">הכל בסדר</p>
          </div>
        )}

        {items.length > 6 && (
          <p className="pt-1 text-center text-xs text-gray-400">
            ועוד {items.length - 6} פריטים נוספים
          </p>
        )}
      </div>
    </div>
  );
};

AttentionSection.displayName = "AttentionSection";
