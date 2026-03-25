import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../../utils/utils";
import { staggerDelay } from "../../../utils/animation";

export interface StatItem {
  key: string;
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  variant: "blue" | "green" | "red" | "amber" | "purple";
  urgent?: boolean;
  href?: string;
}

interface DashboardStatsGridProps {
  stats: StatItem[];
}

/* ── Variant styles ─────────────────────────────────────────────────────── */

const variantStyles: Record<
  StatItem["variant"],
  { border: string; value: string; iconBg: string; strip: string }
> = {
  blue:   { border: "border-r-4 border-r-primary-500",   value: "text-primary-600",    iconBg: "bg-primary-50 text-primary-500",     strip: "from-primary-500/10 to-transparent"   },
  green:  { border: "border-r-4 border-r-emerald-500", value: "text-emerald-600", iconBg: "bg-emerald-50 text-emerald-500", strip: "from-emerald-500/10 to-transparent" },
  red:    { border: "border-r-4 border-r-red-500",     value: "text-red-600",     iconBg: "bg-red-50 text-red-500",       strip: "from-red-500/10 to-transparent"    },
  amber:  { border: "border-r-4 border-r-amber-500",   value: "text-amber-600",   iconBg: "bg-amber-50 text-amber-500",   strip: "from-amber-500/10 to-transparent"  },
  purple: { border: "border-r-4 border-r-violet-500",  value: "text-violet-600",  iconBg: "bg-violet-50 text-violet-500", strip: "from-violet-500/10 to-transparent" },
};

/* ── Animated counter ───────────────────────────────────────────────────── */

const useAnimatedCount = (target: number, delay: number = 0): number => {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const duration = 800;

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(target * eased));
        if (progress < 1) frameRef.current = requestAnimationFrame(tick);
      };

      frameRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frameRef.current);
    };
  }, [target, delay]);

  return display;
};

/* ── Single stat card ───────────────────────────────────────────────────── */

interface StatCardProps {
  stat: StatItem;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ stat, index }) => {
  const count = useAnimatedCount(stat.value, index * 80);
  const IconComponent = stat.icon;

  const styles = variantStyles[stat.variant];

  const cardClass = cn(
    "group relative overflow-hidden rounded-2xl border border-gray-100 bg-white",
    "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/60",
    "animate-fade-in",
    styles.border,
    stat.urgent && "ring-2 ring-red-200 ring-offset-1",
    stat.href && "cursor-pointer",
  );

  const inner = (
    <div className="relative flex items-center gap-3 p-3">
      {/* Icon */}
      <div className={cn(
        "shrink-0 rounded-lg p-2 shadow-sm transition-transform duration-300 group-hover:scale-110",
        styles.iconBg
      )}>
        <IconComponent className="h-4 w-4" />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className={cn(
          "text-2xl font-black tabular-nums tracking-tight leading-none",
          styles.value
        )}>
          {count.toLocaleString("he-IL")}
        </div>
        <p className="mt-0.5 text-xs font-semibold text-gray-800 truncate">{stat.title}</p>
        <p className="text-[0.65rem] text-gray-400 truncate">{stat.description}</p>
      </div>

      {stat.urgent && (
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
        </span>
      )}
    </div>
  );

  if (stat.href) {
    return (
      <Link
        to={stat.href}
        className={cardClass}
        style={{ animationDelay: staggerDelay(index, 60) }}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      className={cardClass}
      style={{ animationDelay: staggerDelay(index, 60) }}
    >
      {inner}
    </div>
  );
};
StatCard.displayName = "StatCard";

/* ── Grid ───────────────────────────────────────────────────────────────── */

export const DashboardStatsGrid = ({ stats }: DashboardStatsGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.key} stat={stat} index={index} />
      ))}
    </div>
  );
};

DashboardStatsGrid.displayName = "DashboardStatsGrid";