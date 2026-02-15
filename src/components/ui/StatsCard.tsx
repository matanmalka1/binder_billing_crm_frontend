import { useEffect, useState } from "react";
import { cn } from "../../utils/utils";
import type { LucideIcon } from "lucide-react";

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
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  variant = "neutral",
  trend,
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
      bg: "from-blue-500/10 to-indigo-500/10",
      border: "border-blue-200/50",
      text: "text-blue-700",
      icon: "bg-blue-100 text-blue-600",
      accent: "bg-gradient-to-br from-blue-400 to-indigo-600",
    },
    green: {
      bg: "from-emerald-500/10 to-teal-500/10",
      border: "border-emerald-200/50",
      text: "text-emerald-700",
      icon: "bg-emerald-100 text-emerald-600",
      accent: "bg-gradient-to-br from-emerald-400 to-teal-600",
    },
    red: {
      bg: "from-red-500/10 to-rose-500/10",
      border: "border-red-200/50",
      text: "text-red-700",
      icon: "bg-red-100 text-red-600",
      accent: "bg-gradient-to-br from-red-400 to-rose-600",
    },
    orange: {
      bg: "from-orange-500/10 to-amber-500/10",
      border: "border-orange-200/50",
      text: "text-orange-700",
      icon: "bg-orange-100 text-orange-600",
      accent: "bg-gradient-to-br from-orange-400 to-amber-600",
    },
    purple: {
      bg: "from-purple-500/10 to-fuchsia-500/10",
      border: "border-purple-200/50",
      text: "text-purple-700",
      icon: "bg-purple-100 text-purple-600",
      accent: "bg-gradient-to-br from-purple-400 to-fuchsia-600",
    },
    neutral: {
      bg: "from-gray-500/10 to-slate-500/10",
      border: "border-gray-200/50",
      text: "text-gray-700",
      icon: "bg-gray-100 text-gray-600",
      accent: "bg-gradient-to-br from-gray-400 to-slate-600",
    },
  };

  const config = variants[variant];

  return (
    <div
      className={cn(
        "relative rounded-xl p-6 transition-all duration-300",
        "bg-gradient-to-br",
        config.bg,
        "border",
        config.border,
        "hover:shadow-elevation-2 hover:-translate-y-1",
        "overflow-hidden",
        "animate-scale-in",
        className
      )}
    >
      {/* Decorative gradient accent */}
      <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-30 blur-3xl", config.accent)} />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
            <div className={cn("text-3xl font-bold tracking-tight", config.text)}>
              {typeof value === "number" ? displayValue.toLocaleString('he-IL') : value}
            </div>
          </div>

          {/* Icon with gradient background */}
          {Icon && (
            <div className={cn("rounded-lg p-3 shadow-sm", config.icon)}>
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>

        {/* Description and trend */}
        <div className="space-y-2">
          {description && (
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
          )}

          {trend && (
            <div className="flex items-center gap-2 text-sm">
              <span className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium",
                trend.value > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
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
