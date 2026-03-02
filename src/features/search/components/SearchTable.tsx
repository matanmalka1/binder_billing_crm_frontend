import { Card } from "../../../components/ui/Card";
import type { SearchResult } from "../../../api/search.api";
import { SearchRow } from "./SearchRow";

interface SearchTableProps {
  results: SearchResult[];
}

export const SearchTable: React.FC<SearchTableProps> = ({ results }) => {
  return (
    <Card variant="elevated" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
            <tr className="text-right border-b-2 border-gray-200">
              <th className="pb-4 pr-6 pt-4 text-sm font-semibold text-gray-700">
                סוג
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                לקוח
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                מספר קלסר
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                מצב עבודה
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
            {results.map((result, index) => (
              <SearchRow
                key={`${result.result_type}-${result.client_id}-${result.binder_id ?? "none"}-${index}`}
                result={result}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
