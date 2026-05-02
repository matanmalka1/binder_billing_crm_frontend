import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Alert } from '@/components/ui/overlays/Alert'
import { Button } from '@/components/ui/primitives/Button'
import { PaginatedDataTable } from '@/components/ui/table/PaginatedDataTable'
import { AgingReportView } from '@/features/reports'
import {
  ChargeBulkToolbar,
  buildChargeColumns,
  ChargesCreateModal,
  ChargeDetailDrawer,
  ChargesFiltersCard,
  ChargesSummaryBar,
  useChargesPage,
} from '@/features/charges'
import { getChargeRowClassName, getChargesEmptyState } from '../helpers'

type ChargesViewMode = 'charges' | 'aging'

export const Charges: React.FC = () => {
  const [, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState<ChargesViewMode>('charges')
  const [selectedChargeId, setSelectedChargeId] = useState<number | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const {
    actionLoadingId,
    bulkLoading,
    charges,
    createError,
    createLoading,
    error,
    filters,
    isAdvisor,
    loading,
    runAction,
    runBulkAction,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    setFilter,
    stats,
    submitCreate,
    total,
  } = useChargesPage()
  const allIds = useMemo(() => charges.map((c) => c.id), [charges])
  const columns = useMemo(
    () =>
      buildChargeColumns({
        isAdvisor,
        actionLoadingId,
        runAction,
        onOpenDetail: setSelectedChargeId,
        selectedIds,
        onToggleSelect: toggleSelect,
        onToggleAll: toggleSelectAll,
        allIds,
      }),
    [isAdvisor, actionLoadingId, runAction, selectedIds, toggleSelect, toggleSelectAll, allIds],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="חיובים"
        description={
          viewMode === 'charges'
            ? 'רשימת חיובים ופעולות חיוב נתמכות'
            : 'לקוחות עם חובות פתוחים לפי גיל החוב'
        }
        actions={
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-gray-200 bg-white p-0.5">
              <Button
                variant={viewMode === 'charges' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('charges')}
              >
                רשימת חיובים
              </Button>
              <Button
                variant={viewMode === 'aging' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('aging')}
              >
                גיול חובות
              </Button>
            </div>
            {isAdvisor && viewMode === 'charges' && (
              <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(true)}>
                חיוב חדש
                <Plus className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        }
      />

      {viewMode === 'charges' ? (
        <>
          <ChargesSummaryBar
            stats={stats}
            isAdvisor={isAdvisor}
            currentStatus={filters.status}
            onStatusClick={(status) => setFilter('status', status)}
          />

          {!isAdvisor && (
            <Alert variant="info" message="צפייה בלבד. יצירה ושינוי חיובים זמינים ליועץ בלבד." />
          )}

          <ChargesFiltersCard
            filters={filters}
            onFilterChange={setFilter}
            onClear={() => setSearchParams(new URLSearchParams())}
          />

          {isAdvisor && selectedIds.size > 0 && (
            <ChargeBulkToolbar
              selectedCount={selectedIds.size}
              loading={bulkLoading}
              onAction={runBulkAction}
              onClear={clearSelection}
            />
          )}

          <PaginatedDataTable
            data={charges}
            columns={columns}
            getRowKey={(charge) => charge.id}
            onRowClick={(charge) => setSelectedChargeId(charge.id)}
            isLoading={loading}
            error={error}
            page={filters.page}
            pageSize={filters.page_size}
            total={total}
            label="חיובים"
            onPageChange={(page) => setFilter('page', String(page))}
            onPageSizeChange={(pageSize) => setFilter('page_size', String(pageSize))}
            rowClassName={(charge) => getChargeRowClassName(charge.status)}
            emptyMessage="אין חיובים להצגה"
            emptyState={getChargesEmptyState(isAdvisor, () => setShowCreateModal(true))}
          />
        </>
      ) : (
        <AgingReportView embedded />
      )}

      <ChargeDetailDrawer chargeId={selectedChargeId} onClose={() => setSelectedChargeId(null)} />
      <ChargesCreateModal
        open={showCreateModal}
        createError={createError}
        createLoading={createLoading}
        onClose={() => setShowCreateModal(false)}
        onSubmit={submitCreate}
      />
    </div>
  )
}
