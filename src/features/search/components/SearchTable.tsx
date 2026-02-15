import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { User, FileText, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getSignalLabel,
  getSlaStateLabel,
  getWorkStateLabel,
} from "../../../utils/enums";
import { getResultTypeLabel } from "../../../constants/filterOptions.constants";
import type { SearchResult } from "../../../api/search.api";
import { cn } from "../../../utils/utils";

interface SearchTableProps {
  results: SearchResult[];
}

const getResultIcon = (resultType: string) => {
  if (resultType === "binder") return <FileText className="h-4 w-4" />;
  if (resultType === "client") return <User className="h-4 w-4" />;
  return null;
};

const getResultColor = (resultType: string) => {
  if (resultType === "binder") return "text-blue-600 bg-blue-50";
  if (resultType === "client") return "text-green-600 bg-green-50";
  return "text-gray-600 bg-gray-50";
};

export const SearchTable: React.FC<SearchTableProps> = ({ results }) => {
  return (
    <Card variant="elevated" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Enhanced Header */}
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
            <tr className="text-right border-b-2 border-gray-200">
              <th className="pb-4 pr-6 pt-4 text-sm font-semibold text-gray-700">
                סוג
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                לקוח
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                מספר תיק
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                מצב עבודה
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                מצב SLA
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                אותות
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                פעולות
              </th>
            </tr>
          </thead>

          {/* Enhanced Body */}
          <tbody className="divide-y divide-gray-100">
            {results.map((result, index) => {
              const resultKey = `${result.result_type}-${result.client_id}-${result.binder_id}-${index}`;
              const isClient = result.result_type === "client";
              const isBinder = result.result_type === "binder";
              const detailUrl =
                isBinder && result.binder_id
                  ? `/binders/${result.binder_id}`
                  : isClient
                    ? `/clients/${result.client_id}/timeline`
                    : null;

              return (
                <tr
                  key={resultKey}
                  className={cn(
                    "group transition-all duration-200",
                    "hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-transparent",
                    "animate-fade-in",
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {/* Result Type */}
                  <td className="py-4 pr-6">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-1 rounded-full bg-gradient-to-b from-primary-400 to-primary-600 opacity-0 transition-opacity group-hover:opacity-100" />
                      <div
                        className={cn(
                          "rounded-lg p-2",
                          getResultColor(result.result_type),
                        )}
                      >
                        {getResultIcon(result.result_type)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {getResultTypeLabel(result.result_type)}
                      </span>
                    </div>
                  </td>

                  {/* Client Name */}
                  <td className="py-4 pr-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {result.client_name ?? "—"}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        לקוח #{result.client_id}
                      </p>
                    </div>
                  </td>

                  {/* Binder Number */}
                  <td className="py-4 pr-4">
                    {result.binder_number ? (
                      <span className="font-mono text-sm font-semibold text-gray-900">
                        {result.binder_number}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>

                  {/* Work State */}
                  <td className="py-4 pr-4">
                    <span className="text-sm text-gray-700">
                      {getWorkStateLabel(result.work_state ?? "")}
                    </span>
                  </td>

                  {/* SLA State */}
                  <td className="py-4 pr-4">
                    <span className="text-sm text-gray-700">
                      {getSlaStateLabel(result.sla_state ?? "")}
                    </span>
                  </td>

                  {/* Signals */}
                  <td className="py-4 pr-4">
                    {Array.isArray(result.signals) &&
                    result.signals.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {result.signals.map((signal) => (
                          <Badge
                            key={`${index}-${signal}`}
                            variant="neutral"
                            className="text-xs"
                          >
                            {getSignalLabel(signal)}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 pr-4">
                    {detailUrl ? (
                      <Link
                        to={detailUrl}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-lg",
                          "border border-gray-300 px-3 py-1.5 text-sm",
                          "text-gray-700 transition-all duration-200",
                          "hover:border-primary-400 hover:bg-primary-50 hover:text-primary-900",
                          "hover:shadow-sm hover:-translate-y-0.5",
                        )}
                      >
                        פירוט
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
