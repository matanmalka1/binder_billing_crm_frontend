import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { cn } from "../../utils/utils";
import { staggerDelay } from "../../utils/animation";

export interface Breadcrumb {
  label: string;
  to: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  variant?: "default" | "gradient" | "minimal";
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  variant = "default",
}) => {
  return (
    <header className="space-y-4 animate-fade-in">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm animate-slide-in">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.to} className="flex items-center gap-2">
              {index > 0 && <ChevronLeft className="h-4 w-4 text-gray-400" />}
              <Link
                to={crumb.to}
                className={cn(
                  "font-medium transition-colors duration-200",
                  "hover:text-primary-600",
                  index === breadcrumbs.length - 1
                    ? "text-gray-900"
                    : "text-gray-600"
                )}
              >
                {crumb.label}
              </Link>
            </div>
          ))}
        </nav>
      )}

      {/* Title and Actions Row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          {/* Title */}
          <h1
            className={cn(
              "text-3xl md:text-4xl font-bold tracking-tight",
              variant === "gradient" && "gradient-text",
              variant === "default" && "text-gray-900",
              variant === "minimal" && "text-gray-800"
            )}
            style={variant === "default" ? { fontFamily: 'var(--font-display)' } : undefined}
          >
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Optional Action Buttons */}
        {actions && (
          <div
            className="flex items-center gap-2 animate-slide-in"
            style={{ animationDelay: staggerDelay(1, 100) }}
          >
            {actions}
          </div>
        )}
      </div>

      {/* Decorative underline for gradient variant */}
      {variant === "gradient" && (
        <div className="h-1 w-24 bg-gradient-to-r from-primary-500 via-purple-500 to-accent-500 rounded-full" />
      )}
    </header>
  );
};
