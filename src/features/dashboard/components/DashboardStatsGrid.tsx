import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../../utils/utils";
import { staggerAnimationDelayVars } from "../../../utils/animation";
import { StatsCard } from "@/components/ui/layout/StatsCard";

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
    "animate-fade-in",
    stat.urgent,
    stat.href && "cursor-pointer",
  );

  const inner = (
    <div className="relative">
      <StatsCard
        title={stat.title}
        value={stat.value}
        description={stat.description}
        icon={stat.icon}
        variant={variantMap[stat.variant]}
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
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {stats.map((stat, index) => (
        <StatCard key={stat.key} stat={stat} index={index} />
      ))}
    </div>
  );
};

DashboardStatsGrid.displayName = "DashboardStatsGrid";
