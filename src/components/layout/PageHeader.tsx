import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

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
    <header className="space-y-2">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.to} className="flex items-center gap-2">
              {index > 0 && <ChevronLeft className="h-4 w-4 text-gray-400" />}
              <Link
                to={crumb.to}
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                {crumb.label}
              </Link>
            </div>
          ))}
        </nav>
      )}

      {/* Title and Actions Row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {description && <p className="mt-1 text-gray-600">{description}</p>}
        </div>

        {/* Optional Action Buttons */}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
};
