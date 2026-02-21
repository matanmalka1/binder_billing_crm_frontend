import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../../utils/utils";
import { staggerDelay } from "../../../utils/animation";

export interface SectionItem {
  id: number;
  label: string;
  sublabel?: string;
  href?: string;
}

type Severity = "critical" | "warning" | "info" | "success";

interface AdvisorTodaySectionProps {
  icon: LucideIcon;
  title: string;
  items: SectionItem[];
  severity: Severity;
  emptyLabel: string;
}

/* ── Variant maps ───────────────────────────────────────────────────────── */

const severityIconBgMap: Record<Severity, string> = {
  critical: "bg-red-50 text-red-600",
  warning:  "bg-amber-50 text-amber-600",
  info:     "bg-blue-50 text-blue-600",
  success:  "bg-emerald-50 text-emerald-600",
};

const severityBadgeMap: Record<Severity, string> = {
  critical: "bg-red-100 text-red-700",
  warning:  "bg-amber-100 text-amber-700",
  info:     "bg-blue-100 text-blue-700",
  success:  "bg-emerald-100 text-emerald-700",
};

const severityDotMap: Record<Severity, string> = {
  critical: "bg-red-400",
  warning:  "bg-amber-400",
  info:     "bg-blue-400",
  success:  "bg-emerald-400",
};

/* ── Component ──────────────────────────────────────────────────────────── */

export const AdvisorTodaySection = ({
  icon: Icon,
  title,
  items,
  severity,
  emptyLabel,
}: AdvisorTodaySectionProps) => {
  const hasItems = items.length > 0;

  return (
    <div className="flex flex-col p-5">
      {/* Section title row */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={cn("rounded-lg p-1.5", severityIconBgMap[severity])}>
            <Icon className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-semibold text-gray-800">{title}</span>
        </div>
        {hasItems && (
          <span className={cn(
            "inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-xs font-bold",
            severityBadgeMap[severity]
          )}>
            {items.length}
          </span>
        )}
      </div>

      {/* Items list */}
      {hasItems ? (
        <ul className="max-h-40 space-y-1.5 overflow-y-auto">
          {items.slice(0, 6).map((item, index) => {
            const rowContent = (
              <>
                <span className={cn(
                  "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                  severityDotMap[severity]
                )} />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-gray-800 leading-tight">
                    {item.label}
                  </p>
                  {item.sublabel && (
                    <p className="mt-0.5 truncate text-xs text-gray-400">
                      {item.sublabel}
                    </p>
                  )}
                </div>
              </>
            );

            if (item.href) {
              return (
                <li key={item.id} style={{ animationDelay: staggerDelay(index, 35) }}>
                  <Link
                    to={item.href}
                    className="flex items-start gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-gray-50 animate-fade-in"
                  >
                    {rowContent}
                  </Link>
                </li>
              );
            }

            return (
              <li
                key={item.id}
                className="flex items-start gap-2.5 rounded-lg px-2.5 py-2 animate-fade-in"
                style={{ animationDelay: staggerDelay(index, 35) }}
              >
                {rowContent}
              </li>
            );
          })}
          {items.length > 6 && (
            <li className="py-1 text-center text-xs text-gray-400">
              ועוד {items.length - 6}...
            </li>
          )}
        </ul>
      ) : (
        <p className="text-xs text-gray-400 pr-7">{emptyLabel}</p>
      )}
    </div>
  );
};

AdvisorTodaySection.displayName = "AdvisorTodaySection";
