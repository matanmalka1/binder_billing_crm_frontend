import { Badge } from "../../../components/ui/Badge";
import { Link } from "react-router-dom";
import type { SearchResult } from "../../../api/search.api";
import { cn } from "../../../utils/utils";
import {
  getResultColor,
  getResultIcon,
  getResultLabel,
} from "./searchResultMeta";
import {
  getSignalLabel,
  getSlaStateLabel,
  getWorkStateLabel,
} from "../../../utils/enums";

interface SearchRowProps {
  result: SearchResult;
  index: number;
}

export const SearchRow: React.FC<SearchRowProps> = ({ result, index }) => {
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
            {getResultLabel(result.result_type)}
          </span>
        </div>
      </td>

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

      <td className="py-4 pr-4">
        {result.binder_number ? (
          <span className="font-mono text-sm font-semibold text-gray-900">
            {result.binder_number}
          </span>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </td>

      <td className="py-4 pr-4">
        <span className="text-sm text-gray-700">
          {getWorkStateLabel(result.work_state ?? "")}
        </span>
      </td>

      <td className="py-4 pr-4">
        <span className="text-sm text-gray-700">
          {getSlaStateLabel(result.sla_state ?? "")}
        </span>
      </td>

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
          </Link>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </td>
    </tr>
  );
};
