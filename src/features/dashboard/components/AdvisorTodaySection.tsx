import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { cn } from "../../../utils/utils";
import { staggerAnimationDelayVars } from "../../../utils/animation";
import type { SectionItem } from "../utils";
import { DashboardBadge, DashboardEmptyState } from "./DashboardPrimitives";

interface AdvisorTodaySectionProps {
  icon: LucideIcon;
  title: string;
  items: SectionItem[];
  emptyLabel: string;
  sectionIndex?: number;
  variant?: "default" | "deadline";
}

export const AdvisorTodaySection = ({
  icon: Icon,
  title,
  items,
  emptyLabel,
  sectionIndex = 0,
  variant = "default",
}: AdvisorTodaySectionProps) => {
  const hasItems = items.length > 0;
  const isDeadline = variant === "deadline";

  return (
    <section
      className="animate-fade-in overflow-hidden rounded-2xl border border-gray-200 bg-white [animation-delay:var(--enter-delay)]"
      style={staggerAnimationDelayVars(sectionIndex, 70)}
    >
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Icon className="h-4 w-4" />
          </span>
          <p className="truncate text-xs font-bold text-gray-800">{title}</p>
        </div>
        <DashboardBadge tone={hasItems ? "blue" : "neutral"}>{items.length}</DashboardBadge>
      </div>

      <div className="max-h-[260px] flex-1 overflow-y-auto p-2">
        {hasItems ? (
          <div className={cn(isDeadline ? "space-y-2" : "space-y-1")}>
            {items.map((item, index) => {
              const content = isDeadline ? (
                <>
                  <span className="flex min-h-12 min-w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-amber-100 bg-amber-50 px-3 text-amber-700">
                    <span className="text-[11px] font-semibold leading-4 text-amber-600">מועד</span>
                    <span className="text-xs font-bold leading-4">{item.sublabel}</span>
                  </span>
                  <span className="min-w-0 flex-1 self-center">
                    <span className="block truncate text-sm font-bold leading-6 text-gray-900">
                      {item.label}
                    </span>
                  </span>
                  {item.href && (
                    <ArrowLeft className="h-4 w-4 shrink-0 self-center text-gray-300 transition-colors group-hover:text-amber-600" />
                  )}
                </>
              ) : (
                <>
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold leading-5 text-gray-800">
                      {item.label}
                    </span>
                    {item.sublabel && (
                      <span className="block truncate text-[11px] leading-4 text-gray-500">
                        {item.sublabel}
                      </span>
                    )}
                  </span>
                  {item.href && (
                    <ArrowLeft className="mt-1 h-3.5 w-3.5 shrink-0 text-gray-300 transition-colors group-hover:text-blue-500" />
                  )}
                </>
              );

              const className = cn(
                "animate-fade-in flex gap-3 rounded-xl text-right [animation-delay:var(--enter-delay)]",
                isDeadline ? "items-stretch border border-gray-100 bg-white px-3 py-3 shadow-sm" : "items-start px-3 py-2.5",
                item.href && "group transition-colors",
                item.href && (isDeadline ? "hover:border-amber-200 hover:bg-amber-50/30" : "hover:bg-blue-50/60"),
              );

              if (item.href) {
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    className={className}
                    style={staggerAnimationDelayVars(index, 35)}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <div
                  key={item.id}
                  className={className}
                  style={staggerAnimationDelayVars(index, 35)}
                >
                  {content}
                </div>
              );
            })}
          </div>
        ) : (
          <DashboardEmptyState title={emptyLabel} className="py-8" />
        )}
      </div>
    </section>
  );
};

AdvisorTodaySection.displayName = "AdvisorTodaySection";
