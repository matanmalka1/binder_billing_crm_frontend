import { useEffect, useState } from "react";
import { cn } from "../../../utils/utils";
import type { LucideIcon } from "lucide-react";
import { semanticStatToneClasses } from "@/utils/semanticColors";

export interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  variant?: "blue" | "green" | "red" | "orange" | "purple" | "neutral";
  trend?: {
    value: number;
    label: string;
  };
  /** When provided, renders a progress bar below the value (0–100). */
  progress?: number;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  variant = "neutral",
  trend,
  progress,
  className,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Animated counter effect (handles negative values)
  useEffect(() => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return;
    }

    const duration = 900;
    const from = 0;
    const to = value;
    const start = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.round(from + (to - from) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const variants = {
    blue: {
      ...semanticStatToneClasses.info,
      progress: "bg-info-500",
      progressTrack: "bg-info-50",
    },
    green: {
      ...semanticStatToneClasses.positive,
      progress: "bg-positive-500",
      progressTrack: "bg-positive-50",
    },
    red: {
      ...semanticStatToneClasses.negative,
      progress: "bg-negative-500",
      progressTrack: "bg-negative-50",
    },
    orange: {
      ...semanticStatToneClasses.warning,
      progress: "bg-warning-500",
      progressTrack: "bg-warning-50",
    },
    purple: {
      accent: "bg-violet-500",
      border: "border-r-4 border-r-violet-500",
      iconBg: "bg-violet-50 text-violet-500",
      value: "text-violet-700",
      strip: "from-violet-500/10 to-transparent",
      progress: "bg-violet-500",
      progressTrack: "bg-violet-50",
    },
    neutral: {
      ...semanticStatToneClasses.neutral,
      progress: "bg-gray-500",
      progressTrack: "bg-gray-100",
    },
  };

  const config = variants[variant];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm transition-all duration-200",
        "hover:shadow-md",
        config.border,
        className
      )}
    >
      <div className={cn("absolute bottom-0 right-0 top-0 w-1 rounded-r-xl", config.accent)} />

      <div className="relative flex flex-row-reverse items-start gap-4">
        {Icon && (
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", config.iconBg)}>
            <Icon className="h-5 w-5" />
          </div>
        )}

        <div className="min-w-0 flex-1 text-right">
          <p className="mb-0.5 text-xs text-gray-500">{title}</p>
          <div className={cn("text-lg font-bold leading-tight tabular-nums", config.value)}>
            {typeof value === "number" ? displayValue.toLocaleString("he-IL") : value}
          </div>

          {description && (
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">{description}</p>
          )}

          {progress !== undefined && (
            <div className={cn("mt-3 h-2 w-full rounded-full", config.progressTrack)}>
              <div
                className={cn("h-2 rounded-full transition-all duration-700", config.progress)}
                style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
              />
            </div>
          )}

          {trend && (
            <div className="mt-3 flex flex-row-reverse items-center gap-2 text-sm">
              <span className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
                trend.value > 0 ? "bg-positive-100 text-positive-700" : "bg-negative-100 text-negative-700"
              )}>
                {trend.value > 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-gray-500">{trend.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
