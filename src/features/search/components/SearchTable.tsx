import { Badge } from "../../../components/ui/Badge";
import { getSignalLabel, getSlaStateLabel, getWorkStateLabel } from "../../../utils/enums";
import { getResultTypeLabel } from "../../../constants/filterOptions.constants";
import type { SearchTableProps } from "../types";

export const SearchTable: React.FC<SearchTableProps> = ({ results }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-gray-200">
          <tr className="text-right">
            <th className="pb-3 pr-4 font-semibold text-gray-700">סוג תוצאה</th>
            <th className="pb-3 pr-4 font-semibold text-gray-700">לקוח</th>
            <th className="pb-3 pr-4 font-semibold text-gray-700">מספר תיק</th>
            <th className="pb-3 pr-4 font-semibold text-gray-700">מצב עבודה</th>
            <th className="pb-3 pr-4 font-semibold text-gray-700">מצב SLA</th>
            <th className="pb-3 pr-4 font-semibold text-gray-700">אותות</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {results.map((result, index) => (
            <tr
              key={`${result.result_type}-${result.client_id}-${result.binder_id}-${index}`}
              className="hover:bg-gray-50"
            >
              <td className="py-3 pr-4 text-gray-700">{getResultTypeLabel(result.result_type)}</td>
              <td className="py-3 pr-4 font-medium text-gray-900">{result.client_name ?? "—"}</td>
              <td className="py-3 pr-4 text-gray-700">{result.binder_number ?? "—"}</td>
              <td className="py-3 pr-4 text-gray-700">
                {getWorkStateLabel(result.work_state ?? "")}
              </td>
              <td className="py-3 pr-4 text-gray-700">
                {getSlaStateLabel(result.sla_state ?? "")}
              </td>
              <td className="py-3 pr-4">
                {Array.isArray(result.signals) && result.signals.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {result.signals.map((signal) => (
                      <Badge key={`${index}-${signal}`} variant="neutral">
                        {getSignalLabel(signal)}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
