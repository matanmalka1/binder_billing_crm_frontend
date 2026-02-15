import React from "react";
import { ErrorCard } from "../components/ui/ErrorCard";
import { PageLoading } from "../components/ui/PageLoading";
import { PaginationCard } from "../components/ui/PaginationCard";
import { AccessDenied } from "../components/auth/AccessDenied";
import { ChargesCreateCard } from "../features/charges/components/ChargesCreateCard";
import { ChargesFiltersCard } from "../features/charges/components/ChargesFiltersCard";
import { ChargesTableCard } from "../features/charges/components/ChargesTableCard";
import { useChargesPage } from "../features/charges/hooks/useChargesPage";

export const Charges: React.FC = () => {
  const {
    actionLoadingId,
    charges,
    createError,
    createLoading,
    error,
    filters,
    isAdvisor,
    loading,
    runAction,
    setFilter,
    setSearchParams,
    submitCreate,
    total,
  } = useChargesPage();
  const totalPages = Math.max(1, Math.ceil(total / filters.page_size));

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-gray-900">חיובים</h2>
        <p className="text-gray-600">רשימת חיובים ופעולות חיוב נתמכות</p>
      </header>

      {!isAdvisor && (
        <AccessDenied message="יצירה ושינוי חיובים זמינים ליועץ בלבד. ניתן לצפות ברשימה בלבד." />
      )}

      {isAdvisor && (
        <ChargesCreateCard
          createError={createError}
          createLoading={createLoading}
          onSubmit={submitCreate}
        />
      )}

      <ChargesFiltersCard
        filters={filters}
        onFilterChange={setFilter}
        onClear={() => setSearchParams(new URLSearchParams())}
      />

      {loading && <PageLoading />}

      {error && <ErrorCard message={error} />}

      {!loading && !error && (
        <ChargesTableCard
          actionLoadingId={actionLoadingId}
          charges={charges}
          isAdvisor={isAdvisor}
          onRunAction={runAction}
        />
      )}

      {!loading && !error && (
        <PaginationCard
          page={filters.page}
          total={total}
          totalPages={totalPages}
          onPageChange={(nextPage) => setFilter("page", String(nextPage))}
        />
      )}
    </div>
  );
};
