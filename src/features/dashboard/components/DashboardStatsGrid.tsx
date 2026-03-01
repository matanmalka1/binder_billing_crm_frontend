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

/* ── Variant maps ───────────────────────────────────────────────────────── */

const borderMap: Record<StatItem["variant"], string> = {
  blue:   "border-r-4 border-r-blue-500",
  green:  "border-r-4 border-r-emerald-500",
  red:    "border-r-4 border-r-red-500",
  amber:  "border-r-4 border-r-amber-500",
  purple: "border-r-4 border-r-violet-500",
};

const valueColorMap: Record<StatItem["variant"], string> = {
  blue:   "text-blue-600",
  green:  "text-emerald-600",
  red:    "text-red-600",
  amber:  "text-amber-600",
  purple: "text-violet-600",
};

const iconBgMap: Record<StatItem["variant"], string> = {
  blue:   "bg-blue-50 text-blue-500",
  green:  "bg-emerald-50 text-emerald-500",
  red:    "bg-red-50 text-red-500",
  amber:  "bg-amber-50 text-amber-500",
  purple: "bg-violet-50 text-violet-500",
};

const stripMap: Record<StatItem["variant"], string> = {
  blue:   "from-blue-500/10 to-transparent",
  green:  "from-emerald-500/10 to-transparent",
  red:    "from-red-500/10 to-transparent",
  amber:  "from-amber-500/10 to-transparent",
  purple: "from-violet-500/10 to-transparent",
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

  const cardClass = cn(
    "group relative overflow-hidden rounded-2xl border border-gray-100 bg-white",
    "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/60",
    "animate-fade-in",
    borderMap[stat.variant],
    stat.urgent && "ring-2 ring-red-200 ring-offset-1",
    stat.href && "cursor-pointer",
  );

  const inner = (
    <>
      {/* Top color wash */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-24 bg-gradient-to-b opacity-60",
        stripMap[stat.variant]
      )} />

      <div className="relative p-6">
        {/* Icon row */}
        <div className="mb-5 flex items-start justify-between">
          <div className={cn(
            "rounded-xl p-3 shadow-sm transition-transform duration-300 group-hover:scale-110",
            iconBgMap[stat.variant]
          )}>
            <IconComponent className="h-5 w-5" />
          </div>

          {stat.urgent && (
            <span className="relative flex h-2.5 w-2.5 mt-1">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
          )}
        </div>

        {/* Value */}
        <div className={cn(
          "mb-1 text-4xl font-black tabular-nums tracking-tight leading-none",
          valueColorMap[stat.variant]
        )}>
          {count.toLocaleString("he-IL")}
        </div>

        {/* Divider */}
        <div className="my-3 h-px bg-gray-100" />

        {/* Title + description */}
        <p className="text-sm font-semibold text-gray-800 mb-0.5">{stat.title}</p>
        <p className="text-xs text-gray-400 leading-relaxed">{stat.description}</p>
      </div>
    </>
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