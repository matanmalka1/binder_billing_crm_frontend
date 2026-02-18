import { useMemo } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { FilterBar } from "../components/ui/FilterBar";
import { Badge } from "../components/ui/Badge";
import { PaginationCard } from "../components/ui/PaginationCard";
import { DataTable, type Column } from "../components/ui/DataTable";
import { SearchFiltersBar } from "../features/search/components/SearchFiltersBar";
import { useSearchPage } from "../features/search/hooks/useSearchPage";
import { useDebounce } from "use-debounce";
import { getSignalLabel, getSlaStateLabel, getWorkStateLabel } from "../utils/enums";
import { getResultTypeLabel } from "../constants/filterOptions.constants";
import type { SearchResult } from "../api/search.api";

export const Search: React.FC = () => {
  const { error, filters, handleFilterChange, loading, results, total } = useSearchPage();

  // Debounce text inputs for better UX
  const [debouncedQuery] = useDebounce(filters.query, 500);
  const [debouncedClientName] = useDebounce(filters.client_name, 500);
  const [debouncedIdNumber] = useDebounce(filters.id_number, 500);
  const [debouncedBinderNumber] = useDebounce(filters.binder_number, 500);

  // Show loading indicator while debouncing
  const isDebouncing = useMemo(() => {
    return (
      filters.query !== debouncedQuery ||
      filters.client_name !== debouncedClientName ||
      filters.id_number !== debouncedIdNumber ||
      filters.binder_number !== debouncedBinderNumber
    );
  }, [
    filters.query,
    debouncedQuery,
    filters.client_name,
    debouncedClientName,
    filters.id_number,
    debouncedIdNumber,
    filters.binder_number,
    debouncedBinderNumber,
  ]);

  const columns: Column<SearchResult>[] = useMemo(
    () => [
      {
        key: "result_type",
        header: "סוג תוצאה",
        render: (result) => (
          <Badge variant="info">
            {getResultTypeLabel(result.result_type)}
          </Badge>
        ),
      },
      {
        key: "client_name",
        header: "לקוח",
        render: (result) => (
          <span className="font-medium text-gray-900">{result.client_name ?? "—"}</span>
        ),
      },
      {
        key: "binder_number",
        header: "מספר קלסר",
        render: (result) => (
          <span className="font-mono text-sm text-gray-700">{result.binder_number ?? "—"}</span>
        ),
      },
      {
        key: "work_state",
        header: "מצב עבודה",
        render: (result) => (
          <span className="text-gray-600">{getWorkStateLabel(result.work_state ?? "")}</span>
        ),
      },
      {
        key: "sla_state",
        header: "מצב SLA",
        render: (result) => (
          <span className="text-gray-600">{getSlaStateLabel(result.sla_state ?? "")}</span>
        ),
      },
      {
        key: "signals",
        header: "אותות",
        render: (result) => {
          if (!Array.isArray(result.signals) || result.signals.length === 0) {
            return <span className="text-gray-500">—</span>;
          }

          return (
            <div className="flex flex-wrap gap-1">
              {result.signals.map((signal, idx) => (
                <Badge key={`${result.client_id}-${signal}-${idx}`} variant="neutral">
                  {getSignalLabel(signal)}
                </Badge>
              ))}
            </div>
          );
        },
      },
    ],
    [],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(Math.max(total, 1) / filters.page_size),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="חיפוש"
        description="חיפוש גלובלי על בסיס נתוני שרת בלבד"
      />

      <FilterBar>
        <SearchFiltersBar filters={filters} onFilterChange={handleFilterChange} />
        {isDebouncing && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span>מחפש...</span>
          </div>
        )}
      </FilterBar>

      <div className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="text-sm text-gray-600">
            נמצאו {total.toLocaleString("he-IL")} תוצאות
          </div>
        )}

        <DataTable
          data={results}
          columns={columns}
          getRowKey={(result) => `${result.result_type}-${result.client_id}-${result.binder_id}`}
          isLoading={loading}
          emptyMessage="לא נמצאו תוצאות. נסה להרחיב את קריטריוני החיפוש"
        />

        {!loading && results.length > 0 && (
          <PaginationCard
            page={filters.page}
            totalPages={totalPages}
            total={total}
            onPageChange={(page) => handleFilterChange("page", String(page))}
            showPageSizeSelect
            pageSize={filters.page_size}
            pageSizeOptions={[20, 50, 100]}
            onPageSizeChange={(pageSize) =>
              handleFilterChange("page_size", String(pageSize))
            }
          />
        )}
      </div>
    </div>
  );
};
