import { useMemo } from "react";
import { Search as SearchIcon, FileSearch } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { FilterBar } from "../components/ui/FilterBar";
import { ErrorCard } from "../components/ui/ErrorCard";
import { PageLoading } from "../components/ui/PageLoading";
import { PaginationCard } from "../components/ui/PaginationCard";
import { SearchFiltersBar } from "../features/search/components/SearchFiltersBar";
import { SearchTable } from "../features/search/components/SearchTable";
import { useSearchPage } from "../features/search/hooks/useSearchPage";
import { useDebounce } from "use-debounce";

export const Search: React.FC = () => {
  const { error, filters, handleFilterChange, loading, results, total } = useSearchPage();

  const [debouncedQuery] = useDebounce(filters.query, 500);
  const [debouncedClientName] = useDebounce(filters.client_name, 500);
  const [debouncedIdNumber] = useDebounce(filters.id_number, 500);
  const [debouncedBinderNumber] = useDebounce(filters.binder_number, 500);

  const isDebouncing = useMemo(() => (
    filters.query !== debouncedQuery ||
    filters.client_name !== debouncedClientName ||
    filters.id_number !== debouncedIdNumber ||
    filters.binder_number !== debouncedBinderNumber
  ), [
    filters.query, debouncedQuery,
    filters.client_name, debouncedClientName,
    filters.id_number, debouncedIdNumber,
    filters.binder_number, debouncedBinderNumber,
  ]);

  const hasAnyFilter = Boolean(
    filters.query || filters.client_name || filters.id_number || filters.binder_number ||
    filters.work_state || filters.signal_type.length || filters.has_signals
  );

  const handleReset = () => {
    handleFilterChange("query", "");
    handleFilterChange("client_name", "");
    handleFilterChange("id_number", "");
    handleFilterChange("binder_number", "");
    handleFilterChange("work_state", "");
    handleFilterChange("signal_type", []);
    handleFilterChange("has_signals", "");
  };

  const totalPages = Math.max(1, Math.ceil(Math.max(total, 1) / filters.page_size));

  return (
    <div className="space-y-6">
      <PageHeader
        title="חיפוש"
        description="חיפוש גלובלי על פני לקוחות, קלסרים ואותות"
        variant="gradient"
      />

      <FilterBar
        title="חיפוש וסינון"
        onReset={hasAnyFilter ? handleReset : undefined}
      >
        <SearchFiltersBar filters={filters} onFilterChange={handleFilterChange} />
        {isDebouncing && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
            <span>מחפש...</span>
          </div>
        )}
      </FilterBar>

      {error && <ErrorCard message={error} />}

      {/* Results count */}
      {!loading && !error && hasAnyFilter && results.length > 0 && (
        <div className="flex items-center gap-2">
          <SearchIcon className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            נמצאו{" "}
            <strong className="text-gray-900">{total.toLocaleString("he-IL")}</strong>{" "}
            תוצאות
          </span>
        </div>
      )}

      {/* Loading */}
      {loading && <PageLoading message="מחפש..." />}

      {/* Empty — no filters yet */}
      {!loading && !error && !hasAnyFilter && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/60 py-20 text-center">
          <SearchIcon className="h-10 w-10 text-gray-300" />
          <p className="text-base font-medium text-gray-500">הזן מונח חיפוש או בחר פילטר</p>
          <p className="text-sm text-gray-400">התוצאות יופיעו כאן</p>
        </div>
      )}

      {/* Empty — filters applied, no results */}
      {!loading && !error && hasAnyFilter && results.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/60 py-16 text-center">
          <FileSearch className="h-10 w-10 text-gray-300" />
          <p className="text-base font-medium text-gray-500">לא נמצאו תוצאות</p>
          <p className="text-sm text-gray-400">נסה להרחיב את קריטריוני החיפוש</p>
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <SearchTable results={results} />
      )}

      {/* Pagination */}
      {!loading && results.length > 0 && (
        <PaginationCard
          page={filters.page}
          totalPages={totalPages}
          total={total}
          onPageChange={(page) => handleFilterChange("page", String(page))}
          showPageSizeSelect
          pageSize={filters.page_size}
          pageSizeOptions={[20, 50, 100]}
          onPageSizeChange={(pageSize) => handleFilterChange("page_size", String(pageSize))}
        />
      )}
    </div>
  );
};
