import { useState } from 'react'
import { getYear } from 'date-fns'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, SlidersHorizontal, X, PlusCircle, Calendar, ChevronsUpDown } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Select } from '@/components/ui/inputs/Select'
import { Modal } from '@/components/ui/overlays/Modal'
import { Button } from '@/components/ui/primitives/Button'
import { ClientPickerField } from '@/components/shared/client/ClientPickerField'
import { useClientPickerState } from '@/components/shared/client/useClientPickerState'
import { useAdvancePaymentBatches } from '../hooks/useAdvancePaymentBatches'
import { OverviewKPICards } from '../components/OverviewKPICards'
import { AdvancePaymentBatchRow } from '../components/AdvancePaymentBatchRow'
import { AdvancePaymentDrawer } from '../components/AdvancePaymentDrawer'
import { CreateAdvancePaymentModal } from '../components/CreateAdvancePaymentModal'
import { advancePaymentsApi, advancedPaymentsQK } from '../api'
import type {
  AdvancePaymentOverviewRow,
  UpdateAdvancePaymentPayload,
  AdvancePaymentStatus,
  CreateAdvancePaymentPayload,
} from '../types'
import { ADVANCE_PAYMENT_STATUS_OPTIONS_WITH_ALL, ADVANCE_PAYMENT_FREQUENCY_OPTIONS } from '../constants'
import { parsePositiveInt } from '@/utils/utils'
import { toast } from '../../../utils/toast'
import { showErrorToast } from '../../../utils/utils'
import { useRole } from '../../../hooks/useRole'
import { YEAR_OPTIONS } from '../utils'

const PERIOD_LABELS: Record<string, string> = {
  all: 'כל הסוגים',
  '1': 'חודשי',
  '2': 'דו-חודשי',
}
const PERIOD_CYCLE: Array<null | 1 | 2> = [null, 1, 2]

export const AdvancePayments: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isAdvisor } = useRole()

  const year = parsePositiveInt(searchParams.get('year'), getYear(new Date()))

  const [drawerRow, setDrawerRow] = useState<AdvancePaymentOverviewRow | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<AdvancePaymentStatus | ''>('')
  const [periodFilter, setPeriodFilter] = useState<null | 1 | 2>(null)
  const [openBatches, setOpenBatches] = useState<Set<string>>(new Set())

  // Create flow: pick client → open CreateAdvancePaymentModal
  const [createPickerOpen, setCreatePickerOpen] = useState(false)
  const [createClientId, setCreateClientId] = useState<number | null>(null)
  const createPicker = useClientPickerState({
    onSelect: (c) => setCreateClientId(c.id),
    onClear: () => setCreateClientId(null),
  })

  // Generate schedule flow
  const [genPickerOpen, setGenPickerOpen] = useState(false)
  const [genFrequency, setGenFrequency] = useState<1 | 2>(1)
  const genPicker = useClientPickerState()

  const { batches, isLoading } = useAdvancePaymentBatches(year)

  const totalExpected = batches.reduce((s, b) => s + Number(b.total_expected ?? 0), 0)
  const totalPaid = batches.reduce((s, b) => s + Number(b.total_paid ?? 0), 0)
  const collectionRate = totalExpected > 0 ? Math.round((totalPaid / totalExpected) * 100) : 0
  const overdueTotal = batches.reduce((s, b) => s + b.overdue_count, 0)

  const hasActiveFilters = search !== '' || statusFilter !== '' || periodFilter !== null

  const allKeys = batches.map((b) => `${b.year}-${b.month}`)
  const allExpanded = allKeys.length > 0 && allKeys.every((k) => openBatches.has(k))

  const toggleBatch = (key: string) =>
    setOpenBatches((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  const toggleAll = () =>
    setOpenBatches(allExpanded ? new Set() : new Set(allKeys))

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAdvancePaymentPayload }) =>
      advancePaymentsApi.update(drawerRow!.client_record_id, id, payload),
    onSuccess: () => {
      toast.success('מקדמה עודכנה')
      void queryClient.invalidateQueries({ queryKey: advancedPaymentsQK.all })
      setDrawerRow(null)
    },
    onError: (err) => showErrorToast(err, 'שגיאה בעדכון מקדמה'),
  })

  const createMutation = useMutation({
    mutationFn: (payload: CreateAdvancePaymentPayload) =>
      advancePaymentsApi.create(createClientId!, payload),
    onSuccess: () => {
      toast.success('מקדמה נוצרה')
      void queryClient.invalidateQueries({ queryKey: advancedPaymentsQK.all })
      setCreatePickerOpen(false)
      setCreateClientId(null)
      createPicker.resetClientPicker()
    },
    onError: (err) => showErrorToast(err, 'שגיאה ביצירת מקדמה'),
  })

  const generateMutation = useMutation({
    mutationFn: () =>
      advancePaymentsApi.generateSchedule(genPicker.selectedClient!.id, year, genFrequency),
    onSuccess: (data) => {
      toast.success(data.created > 0 ? `נוצרו ${data.created} מקדמות` : 'הכול קיים')
      void queryClient.invalidateQueries({ queryKey: advancedPaymentsQK.all })
      setGenPickerOpen(false)
      genPicker.resetClientPicker()
    },
    onError: (err) => showErrorToast(err, 'שגיאה ביצירת לוח מקדמות'),
  })

  const handleSave = async (id: number, payload: UpdateAdvancePaymentPayload) => {
    await updateMutation.mutateAsync({ id, payload })
  }

  const handleRowClick = (row: AdvancePaymentOverviewRow) => {
    if (isAdvisor) {
      setDrawerRow(row)
    } else {
      navigate(`/clients/${row.client_record_id}/advance-payments`)
    }
  }

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('')
    setPeriodFilter(null)
  }

  const cyclePeriodFilter = () => {
    const idx = PERIOD_CYCLE.indexOf(periodFilter)
    setPeriodFilter(PERIOD_CYCLE[(idx + 1) % PERIOD_CYCLE.length])
  }

  const periodLabel = periodFilter === null ? 'כל הסוגים' : PERIOD_LABELS[String(periodFilter)]

  return (
    <div className="space-y-6">
      <PageHeader title="מקדמות" description="מעקב שנתי אחר תשלומים, פיגורים וגבייה" />

      <OverviewKPICards
        year={year}
        totalExpected={String(totalExpected)}
        totalPaid={String(totalPaid)}
        collectionRate={collectionRate}
        overdueCount={overdueTotal}
      />

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {isAdvisor && (
          <button
            type="button"
            onClick={() => setCreatePickerOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            הוסף מקדמה
          </button>
        )}
        <div className="h-8 w-px bg-gray-200 hidden sm:block" />
        <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
          <button
            type="button"
            onClick={cyclePeriodFilter}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
              periodFilter !== null
                ? 'bg-white shadow-sm text-blue-600 font-semibold'
                : 'text-gray-700 hover:bg-white hover:shadow-sm'
            }`}
          >
            {periodLabel}
          </button>
          {isAdvisor && (
            <button
              type="button"
              onClick={() => setGenPickerOpen(true)}
              className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-white hover:shadow-sm rounded-lg transition-all flex items-center gap-1.5"
            >
              <Calendar className="h-3.5 w-3.5" />
              צור לוח שנתי
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-gray-700">
            <SlidersHorizontal className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-sm">סינון מתקדם</span>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              ניקוי מסננים
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חיפוש לפי שם עסק..."
              className="w-full pr-9 pl-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AdvancePaymentStatus | '')}
            options={ADVANCE_PAYMENT_STATUS_OPTIONS_WITH_ALL}
          />
          <Select
            value={String(year)}
            onChange={(e) => {
              const next = new URLSearchParams(searchParams)
              next.set('year', e.target.value)
              setSearchParams(next)
            }}
            options={YEAR_OPTIONS}
          />
        </div>
      </div>

      {/* Grouped Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {batches.length > 0 && (
          <div className="flex justify-end px-4 py-2 border-b border-gray-100">
            <button
              type="button"
              onClick={toggleAll}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ChevronsUpDown className="h-3.5 w-3.5" />
              {allExpanded ? 'כווץ הכול' : 'הרחב הכול'}
            </button>
          </div>
        )}
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : batches.length === 0 ? (
          <p className="text-center text-gray-500 py-12 text-sm">אין מקדמות לשנה {year}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse min-w-[960px]">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide text-right align-middle w-16">מס׳</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide text-right align-middle w-[22%]">שם לקוח</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide text-right align-middle w-28">תאריך יעד</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide text-left align-middle w-[10%]">מחזור</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide text-left align-middle w-[10%]">צפוי</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide text-left align-middle w-[10%]">שולם</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide text-left align-middle w-[10%]">יתרה</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide text-left align-middle w-24">אחוז מקדמה</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide text-center align-middle w-24">סטטוס</th>
                  <th className="px-3 py-1.5 align-middle w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {batches.map((batch) => {
                  const key = `${batch.year}-${batch.month}`
                  return (
                  <AdvancePaymentBatchRow
                    key={key}
                    batch={batch}
                    search={search}
                    statusFilter={statusFilter}
                    periodFilter={periodFilter}
                    open={openBatches.has(key)}
                    onToggle={() => toggleBatch(key)}
                    onRowClick={handleRowClick}
                  />
                )})}

              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer */}
      <AdvancePaymentDrawer
        row={drawerRow as never}
        open={drawerRow !== null}
        isUpdating={updateMutation.isPending}
        canEdit={isAdvisor}
        onClose={() => setDrawerRow(null)}
        onSave={handleSave}
      />

      {/* Create: pick client modal */}
      <Modal
        open={createPickerOpen && createClientId === null}
        title="הוסף מקדמה — בחר לקוח"
        onClose={() => { setCreatePickerOpen(false); createPicker.resetClientPicker() }}
        footer={
          <Button
            variant="outline"
            onClick={() => { setCreatePickerOpen(false); createPicker.resetClientPicker() }}
          >
            ביטול
          </Button>
        }
      >
        <ClientPickerField
          selectedClient={createPicker.selectedClient}
          clientQuery={createPicker.clientQuery}
          onQueryChange={createPicker.handleClientQueryChange}
          onSelect={createPicker.handleSelectClient}
          onClear={createPicker.handleClearClient}
        />
      </Modal>

      {/* Create: form modal (after client picked) */}
      {createClientId !== null && (
        <CreateAdvancePaymentModal
          open={true}
          clientId={createClientId}
          year={year}
          isCreating={createMutation.isPending}
          onClose={() => { setCreateClientId(null); setCreatePickerOpen(false); createPicker.resetClientPicker() }}
          onCreate={(payload) => createMutation.mutateAsync(payload)}
        />
      )}

      {/* Generate schedule modal */}
      <Modal
        open={genPickerOpen}
        title="צור לוח מקדמות שנתי"
        onClose={() => { setGenPickerOpen(false); genPicker.resetClientPicker() }}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => { setGenPickerOpen(false); genPicker.resetClientPicker() }}
            >
              ביטול
            </Button>
            <Button
              variant="primary"
              isLoading={generateMutation.isPending}
              disabled={genPicker.selectedClient === null}
              onClick={() => generateMutation.mutate()}
            >
              צור לוח
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <ClientPickerField
            selectedClient={genPicker.selectedClient}
            clientQuery={genPicker.clientQuery}
            onQueryChange={genPicker.handleClientQueryChange}
            onSelect={genPicker.handleSelectClient}
            onClear={genPicker.handleClearClient}
          />
          <Select
            label="תדירות"
            value={String(genFrequency)}
            onChange={(e) => setGenFrequency(Number(e.target.value) as 1 | 2)}
            options={ADVANCE_PAYMENT_FREQUENCY_OPTIONS}
          />
        </div>
      </Modal>
    </div>
  )
}
