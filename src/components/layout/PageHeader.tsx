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
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
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
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black">
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
    </header>
  );
};
