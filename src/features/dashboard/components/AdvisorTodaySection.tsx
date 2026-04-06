import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Inbox } from "lucide-react";
import { cn } from "../../../utils/utils";
import { staggerAnimationDelayVars } from "../../../utils/animation";
import type { SectionItem } from "../utils";

interface AdvisorTodaySectionProps {
  icon: LucideIcon;
  title: string;
  items: SectionItem[];
  emptyLabel: string;
  sectionIndex?: number;
}

/* ── Component ──────────────────────────────────────────────────────────── */

export const AdvisorTodaySection = ({
  icon: Icon,
  title,
  items,
  emptyLabel,
  sectionIndex = 0,
}: AdvisorTodaySectionProps) => {
  const hasItems = items.length > 0;

  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-elevation-1 animate-fade-in [animation-delay:var(--enter-delay)]"
      style={staggerAnimationDelayVars(sectionIndex, 70)}
    >
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-white p-1.5 shadow-sm">
            <Icon className="h-3.5 w-3.5 text-gray-500" />
          </div>
          <p className="text-xs font-bold text-gray-700 tracking-wide">{title}</p>
        </div>

        <span className={`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[11px] font-bold tabular-nums ${hasItems ? "bg-gray-200 text-gray-700" : "bg-gray-100 text-gray-300"}`}>
          {items.length}
        </span>
      </div>

      <div className="max-h-[280px] flex-1 divide-y divide-gray-50 overflow-y-auto">
        {hasItems ? (
          items.map((item, index) => {
            const content = (
              <>
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gray-400" />
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
                    "group flex items-start gap-3 px-5 py-3 transition-colors duration-150 animate-fade-in [animation-delay:var(--enter-delay)]",
                    "hover:bg-gray-50"
                  )}
                  style={staggerAnimationDelayVars(index, 35)}
                >
                  {content}
                </Link>
              );
            }

            return (
              <div
                key={item.id}
                className="flex items-start gap-3 px-5 py-3 animate-fade-in [animation-delay:var(--enter-delay)]"
                style={staggerAnimationDelayVars(index, 35)}
              >
                {content}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <Inbox className="h-7 w-7 text-gray-300" />
            <p className="text-xs text-gray-400">{emptyLabel}</p>
          </div>
        )}
      </div>

    </div>
  );
};

AdvisorTodaySection.displayName = "AdvisorTodaySection";
