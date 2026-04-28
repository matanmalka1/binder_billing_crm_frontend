import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../../utils/utils";
import { staggerAnimationDelayVars } from "../../../utils/animation";
import { StatsCard } from "@/components/ui/layout/StatsCard";

export interface StatItem {
  key: string;
  title: string;
  value: string | number;
  description: string;
  eyebrow?: string;
  icon: LucideIcon;
  variant: "blue" | "green" | "red" | "amber" | "purple";
  urgent?: boolean;
  href?: string;
  progress?: number;
  actionLabel?: string;
}

interface DashboardStatsGridProps {
  stats: StatItem[];
}

/* ── Single stat card ───────────────────────────────────────────────────── */

interface StatCardProps {
  stat: StatItem;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ stat, index }) => {
  const variantMap = {
    blue: "blue",
    green: "green",
    red: "red",
    amber: "orange",
    purple: "purple",
  } as const;

  const cardClass = cn(
    "group relative transition-all duration-300 hover:-translate-y-1",
    "animate-fade-in h-full",
    stat.urgent,
    stat.href && "cursor-pointer",
  );

  const inner = (
    <div className="relative h-full">
      <StatsCard
        title={stat.title}
        value={stat.value}
        description={stat.description}
        eyebrow={stat.eyebrow}
        icon={stat.icon}
        variant={variantMap[stat.variant]}
        progress={stat.progress}
        actionLabel={stat.actionLabel}
        compact
      />
      {stat.urgent && (
        <span className="absolute left-3 top-3 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-negative-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-negative-500" />
        </span>
      )}
    </div>
  );

  if (stat.href) {
    return (
      <Link
        to={stat.href}
        className={`${cardClass} [animation-delay:var(--enter-delay)]`}
        style={staggerAnimationDelayVars(index, 60)}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      className={`${cardClass} [animation-delay:var(--enter-delay)]`}
      style={staggerAnimationDelayVars(index, 60)}
    >
      {inner}
    </div>
  );
};
StatCard.displayName = "StatCard";

/* ── Grid ───────────────────────────────────────────────────────────────── */

export const DashboardStatsGrid = ({ stats }: DashboardStatsGridProps) => {
  return (
    <div className="grid grid-cols-5 gap-2 items-stretch">
      {stats.map((stat, index) => (
        <StatCard key={stat.key} stat={stat} index={index} />
      ))}
    </div>
  );
};

DashboardStatsGrid.displayName = "DashboardStatsGrid";
