import { Search as SearchIcon } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { FilterBar } from "../components/ui/FilterBar";
import { PaginatedTableView } from "../components/ui/PaginatedTableView";
import { ErrorCard } from "../components/ui/ErrorCard";
import { PageLoading } from "../components/ui/PageLoading";
import { SearchFiltersBar } from "../features/search/components/SearchFiltersBar";
import { SearchTable } from "../features/search/components/SearchTable";
import { useSearchPage } from "../features/search/hooks/useSearchPage";

export const Search: React.FC = () => {
  const { error, filters, handleFilterChange, loading, results, total } = useSearchPage();

  return (
    <div className="space-y-6">
      <PageHeader
        title="חיפוש"
        description="חיפוש גלובלי על בסיס נתוני שרת בלבד"
      />

      <FilterBar>
        <SearchFiltersBar filters={filters} onFilterChange={handleFilterChange} />
      </FilterBar>

      {loading && <PageLoading />}

      {error && <ErrorCard message={error} />}

      {!loading && !error && (
        <PaginatedTableView
          data={results}
          loading={false}
          error={null}
          pagination={{
            page: filters.page,
            pageSize: filters.page_size,
            total,
            onPageChange: (page) => handleFilterChange("page", String(page)),
          }}
          renderTable={(data) => <SearchTable results={data} />}
          emptyState={{ icon: SearchIcon, message: "לא נמצאו תוצאות" }}
          skeletonRows={filters.page_size}
          skeletonColumns={6}
        />
      )}
    </div>
  );
};
