import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Inbox } from "lucide-react";
import { cn } from "../../../utils/utils";
import { staggerDelay } from "../../../utils/animation";
import type { AdvisorSeverity, SectionItem } from "../utils";
import { advisorSeverityCfg } from "../utils";

interface AdvisorTodaySectionProps {
  icon: LucideIcon;
  title: string;
  items: SectionItem[];
  severity: AdvisorSeverity;
  emptyLabel: string;
  sectionIndex?: number;
}

/* ── Component ──────────────────────────────────────────────────────────── */

export const AdvisorTodaySection = ({
  icon: Icon,
  title,
  items,
  severity,
  emptyLabel,
  sectionIndex = 0,
}: AdvisorTodaySectionProps) => {
  const hasItems = items.length > 0;
  const cfg = advisorSeverityCfg[severity];

  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-elevation-1 animate-fade-in"
      style={{ animationDelay: `${sectionIndex * 70}ms` }}
    >
      <div className={cn("flex items-center justify-between bg-gradient-to-l px-5 py-3", cfg.headerGradient)}>
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-white/20 p-1.5">
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-wide">{title}</p>
            <p className="text-[11px] text-white/60">{hasItems ? "פריטים לטיפול" : emptyLabel}</p>
          </div>
        </div>

        <span className={cn(
          "inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full px-2 text-xs font-bold tabular-nums",
          cfg.countPill
        )}>
          {items.length}
        </span>
      </div>

      <div className="flex-1 divide-y divide-gray-50 overflow-y-auto" style={{ maxHeight: "230px" }}>
        {hasItems ? (
          items.slice(0, 6).map((item, index) => {
            const content = (
              <>
                <div className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", cfg.itemDot)} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-gray-800 leading-tight">
                    {item.label}
                    {item.sublabel && (
                      <span className="text-[11px] text-gray-500"> · {item.sublabel}</span>
                    )}
                  </p>
                </div>
                {item.href && (
                  <ArrowLeft className="mt-1 h-3.5 w-3.5 shrink-0 text-gray-300 transition-colors group-hover:text-gray-500" />
                )}
              </>
            );

            if (item.href) {
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={cn(
                    "group flex items-start gap-3 px-5 py-3 transition-colors duration-150",
                    cfg.itemHover
                  )}
                  style={{ animationDelay: staggerDelay(index, 35) }}
                >
                  {content}
                </Link>
              );
            }

            return (
              <div
                key={item.id}
                className="flex items-start gap-3 px-5 py-3"
                style={{ animationDelay: staggerDelay(index, 35) }}
              >
                {content}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <Inbox className={cn("h-7 w-7", cfg.emptyIcon)} />
            <p className="text-xs text-gray-400">{emptyLabel}</p>
          </div>
        )}
      </div>

      {hasItems && items.length > 6 && (
        <div className="border-t border-gray-100 px-5 py-2.5 text-center text-xs text-gray-400">
          ועוד {items.length - 6}...
        </div>
      )}
    </div>
  );
};

AdvisorTodaySection.displayName = "AdvisorTodaySection";
