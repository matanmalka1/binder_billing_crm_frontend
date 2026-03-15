import { useRef, useState } from "react";
import { Search as SearchIcon, FileSearch, X } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { ToolbarContainer } from "../components/ui/ToolbarContainer";
import { DataTable } from "../components/ui/DataTable";
import { Alert } from "../components/ui/Alert";
import { PaginationCard } from "../components/ui/PaginationCard";
import { StateCard } from "../components/ui/StateCard";
import { SearchFiltersBar } from "../features/search/components/SearchFiltersBar";
import { searchColumns } from "../features/search/components/SearchColumns";
import { useSearchPage } from "../features/search/hooks/useSearchPage";
import { cn } from "../utils/utils";
import type { SearchResult } from "../api/search.api";

export const Search: React.FC = () => {
  const { error, filters, handleFilterChange, handleReset, loading, results, total } = useSearchPage();
  const inputRef = useRef<HTMLInputElement>(null);

  const hasAdvancedFilter = Boolean(
    filters.client_name || filters.id_number || filters.binder_number ||
    filters.work_state || filters.signal_type.length || filters.has_signals,
  );

  const [filtersOpen, setFiltersOpen] = useState(hasAdvancedFilter);

  const hasAnyFilter = Boolean(filters.query) || hasAdvancedFilter;
  const totalPages = Math.max(1, Math.ceil(Math.max(total, 1) / filters.page_size));

  const handleResetAll = () => {
    handleReset();
    setFiltersOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="חיפוש"
        description="חיפוש גלובלי על פני לקוחות, קלסרים ואותות"
      />

      {/* Hero search bar */}
      <ToolbarContainer className="flex items-center gap-3 py-3">
        <SearchIcon className="h-5 w-5 shrink-0 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={filters.query}
          onChange={(e) => handleFilterChange("query", e.target.value)}
          placeholder="חיפוש חופשי — שם לקוח, מספר קלסר..."
          className={cn(
            "min-w-0 flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400",
            "outline-none",
          )}
          autoFocus
          dir="rtl"
        />
        {filters.query && (
          <button
            type="button"
            onClick={() => handleFilterChange("query", "")}
            className="shrink-0 rounded-md p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
            aria-label="נקה חיפוש"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </ToolbarContainer>

      {/* Advanced filters */}
      <ToolbarContainer>
        <SearchFiltersBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetAll}
          isOpen={filtersOpen}
          onToggle={() => setFiltersOpen((o) => !o)}
        />
      </ToolbarContainer>

      {error && <Alert variant="error" message={error} />}

      {/* No filter active */}
      {!loading && !error && !hasAnyFilter && (
        <StateCard
          icon={SearchIcon}
          title="מה תרצה למצוא?"
          message="הקלד שם לקוח, מספר קלסר, או השתמש בפילטרים המתקדמים"
          variant="illustration"
        />
      )}

      {/* Filter active, no results */}
      {!loading && !error && hasAnyFilter && results.length === 0 && (
        <StateCard
          icon={FileSearch}
          title="לא נמצאו תוצאות"
          message="נסה להרחיב את קריטריוני החיפוש או לאפס את הפילטרים"
          action={{ label: "איפוס חיפוש", onClick: handleResetAll }}
        />
      )}

      {/* Results */}
      {(loading || results.length > 0) && (
        <>
          {!loading && (
            <p className="px-1 text-sm text-gray-500">
              נמצאו{" "}
              <strong className="text-gray-900">{total.toLocaleString("he-IL")}</strong>{" "}
              תוצאות
            </p>
          )}

          <DataTable<SearchResult>
            data={results}
            columns={searchColumns}
            getRowKey={(r) => `${r.result_type}-${r.client_id}-${r.binder_id ?? "none"}`}
            isLoading={loading}
            emptyMessage="אין תוצאות"
          />

          {!loading && total > 0 && (
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
        </>
      )}
    </div>
  );
};
