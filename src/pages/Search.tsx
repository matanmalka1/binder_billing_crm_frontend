import { ErrorCard } from "../components/ui/ErrorCard";
import { PageLoading } from "../components/ui/PageLoading";
import { SearchContent } from "../features/search/components/SearchContent";
import { useSearchPage } from "../features/search/hooks/useSearchPage";

export const Search: React.FC = () => {
  const { error, filters, handleFilterChange, loading, results, total } = useSearchPage();

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-gray-900">חיפוש</h2>
        <p className="text-gray-600">חיפוש גלובלי על בסיס נתוני שרת בלבד</p>
      </header>

      {loading ? (
        <PageLoading />
      ) : (
        <SearchContent
          total={total}
          filters={filters}
          results={results}
          onFilterChange={handleFilterChange}
        />
      )}

      {error && <ErrorCard message={error} />}
    </div>
  );
};
