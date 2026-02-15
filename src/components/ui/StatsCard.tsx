import { Card } from "./Card";
import { cn } from "../../utils/utils";
import type { LucideIcon } from "lucide-react";

export interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  variant?: "blue" | "green" | "red" | "orange" | "purple" | "neutral";
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  variant = "neutral",
  className,
}) => {
  const variants = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    orange: "text-orange-600",
    purple: "text-purple-600",
    neutral: "text-gray-600",
  };

  return (
    <Card className={className}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className={cn("mt-2 text-3xl font-bold", variants[variant])}>
            {value}
          </div>
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>

        {/* Optional Icon */}
        {Icon && (
          <div className={cn("rounded-lg bg-gray-50 p-3", `bg-${variant}-50`)}>
            <Icon className={cn("h-6 w-6", variants[variant])} />
          </div>
        )}
      </div>
    </Card>
  );
};
