import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import type { AttentionItem } from "../../../api/dashboard.api";
import { cn } from "../../../utils/utils";
import { SECTIONS } from "../utils";

interface UrgencyBarProps {
  items: AttentionItem[];
}

const sectionMeta = {
  overdue: {
    href: "/binders",
    chip: "bg-red-500/10 text-red-600 ring-red-500/20 hover:bg-red-500/15",
    dot: "bg-red-500",
    pulse: true,
  },
  unpaid: {
    href: "/charges?status=issued",
    chip: "bg-amber-500/10 text-amber-600 ring-amber-500/20 hover:bg-amber-500/15",
    dot: "bg-amber-500",
    pulse: false,
  },
  ready: {
    href: "/binders?status=ready_for_pickup",
    chip: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 hover:bg-emerald-500/15",
    dot: "bg-emerald-500",
    pulse: false,
  },
} as const;

export const UrgencyBar: React.FC<UrgencyBarProps> = ({ items }) => {
  const counts = SECTIONS.map((s) => ({
    ...s,
    count: items.filter((i) => s.types.includes(i.item_type)).length,
    meta: sectionMeta[s.key as keyof typeof sectionMeta],
  }));

  if (items.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-600 animate-fade-in">
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
        <span>הכל תקין — אין פריטים דחופים</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 animate-fade-in">
      <span className="text-[11px] font-medium tracking-wide text-gray-400 ml-0.5">
        דורש טיפול
      </span>

      {counts.map(({ key, title, count, meta }) => {
        if (count === 0) return null;

        return (
          <Link
            key={key}
            to={meta.href}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset transition-colors",
              meta.chip,
            )}
          >
            {meta.pulse ? (
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
              </span>
            ) : (
              <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", meta.dot)} />
            )}
            {title}
            <span className="font-semibold tabular-nums">{count}</span>
          </Link>
        );
      })}
    </div>
  );
};

UrgencyBar.displayName = "UrgencyBar";
