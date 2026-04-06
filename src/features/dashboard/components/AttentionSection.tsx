import { Link } from "react-router-dom";
import { ArrowLeft, Inbox } from "lucide-react";
import type { AttentionItem } from "../api";
import { cn } from "../../../utils/utils";
import { staggerAnimationDelayVars } from "../../../utils/animation";
import type { SectionConfig } from "../utils";
import { attentionSeverityCfg } from "../utils";

interface AttentionSectionProps {
  section: SectionConfig & { types: readonly string[]; viewAllHref: string };
  items: AttentionItem[];
  sectionIndex: number;
}

/* ── Href resolver ──────────────────────────────────────────────────────── */

const getBusinessHref = (item: AttentionItem, fallback: string): string => {
  if (item.client_id && item.business_id) {
    return `/clients/${item.client_id}/businesses/${item.business_id}`;
  }
  if (item.client_id) {
    return `/clients/${item.client_id}`;
  }
  return fallback;
};

const itemHrefMap: Record<string, (item: AttentionItem) => string> = {
  unpaid_charge: (item) => getBusinessHref(item, "/charges?status=issued"),
  unpaid_charges: (item) => getBusinessHref(item, "/charges?status=issued"),
  ready_for_pickup: (item) => getBusinessHref(item, "/binders?status=ready_for_pickup"),
};

const getItemHref = (item: AttentionItem): string => {
  const fn = itemHrefMap[item.item_type];
  return fn ? fn(item) : getBusinessHref(item, "/binders");
};

export const AttentionSection = ({ section, items, sectionIndex }: AttentionSectionProps) => {
  const hasItems = items.length > 0;
  const IconComponent = section.icon;
  const cfg = attentionSeverityCfg[section.severity];

  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-elevation-1 animate-fade-in [animation-delay:var(--enter-delay)]"
      style={staggerAnimationDelayVars(sectionIndex, 80)}
    >
      <div className={cn("flex items-center justify-between bg-gradient-to-l px-5 py-3.5", cfg.headerGradient)}>
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-white/20 p-1.5">
            <IconComponent className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold text-white tracking-wide">{section.title}</span>
        </div>

        <span className={cn(
          "inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full px-2 text-xs font-bold tabular-nums",
          cfg.countPill
        )}>
          {items.length}
        </span>
      </div>

      {/* ── Items list ──────────────────────────────────────────────────── */}
      <div className="max-h-[240px] flex-1 divide-y divide-gray-50 overflow-y-auto">
        {hasItems ? (
          items.map((item, i) => (
            <Link
              key={`${item.item_type}-${item.binder_id ?? i}-${item.business_id ?? item.client_id ?? i}`}
              to={getItemHref(item)}
              className={cn(
                "group flex min-h-[56px] items-start gap-3 px-5 py-3 transition-colors duration-150",
                cfg.itemHover
              )}
            >
              {/* Dot indicator */}
              <div className="mt-1.5 shrink-0">
                <div className={cn("h-2 w-2 rounded-full", cfg.itemDot)} />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                {item.client_name && (
                  <p className="text-xs font-semibold text-gray-800 leading-snug">
                    {item.client_name}
                  </p>
                )}
                <p className="mt-0.5 text-xs text-gray-500 leading-snug">
                  {item.description}
                </p>
              </div>

              {/* Arrow */}
              <ArrowLeft className="mt-1 h-3.5 w-3.5 shrink-0 text-gray-300 transition-colors group-hover:text-gray-500" />
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <Inbox className={cn("h-7 w-7", cfg.emptyIcon)} />
            <p className="text-xs text-gray-400">אין פריטים</p>
          </div>
        )}
      </div>

      {/* ── Footer / view all ───────────────────────────────────────────── */}
      {hasItems && (
        <div className={cn("border-t px-5 py-2.5", cfg.itemBorder)}>
          <Link
            to={section.viewAllHref}
            className={cn("text-xs font-semibold transition-colors", cfg.viewAll)}
          >
            הצג הכל ←
          </Link>
        </div>
      )}
    </div>
  );
};

AttentionSection.displayName = "AttentionSection";
