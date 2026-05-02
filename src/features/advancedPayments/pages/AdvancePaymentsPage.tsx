import { useState } from 'react'
import { getYear } from 'date-fns'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PageHeader } from '@/components/layout/PageHeader'
import { Select } from '@/components/ui/inputs/Select'
import { useAdvancePaymentBatches } from '../hooks/useAdvancePaymentBatches'
import { OverviewKPICards } from '../components/OverviewKPICards'
import { AdvancePaymentBatchRow } from '../components/AdvancePaymentBatchRow'
import { AdvancePaymentDrawer } from '../components/AdvancePaymentDrawer'
import { advancePaymentsApi, advancedPaymentsQK } from '../api'
import type { AdvancePaymentOverviewRow, UpdateAdvancePaymentPayload } from '../types'
import { parsePositiveInt } from '@/utils/utils'
import { toast } from '../../../utils/toast'
import { showErrorToast } from '../../../utils/utils'
import { useRole } from '../../../hooks/useRole'

const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => {
  const y = getYear(new Date()) - 1 + i
  return { value: String(y), label: String(y) }
})

export const AdvancePayments: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isAdvisor } = useRole()

  const year = parsePositiveInt(searchParams.get('year'), getYear(new Date()))

  const [drawerRow, setDrawerRow] = useState<AdvancePaymentOverviewRow | null>(null)

  const { batches, isLoading } = useAdvancePaymentBatches(year)

  const totalExpected = batches.reduce((s, b) => s + Number(b.total_expected ?? 0), 0)
  const totalPaid = batches.reduce((s, b) => s + Number(b.total_paid ?? 0), 0)
  const collectionRate = totalExpected > 0 ? Math.round((totalPaid / totalExpected) * 100) : 0
  const overdueTotal = batches.reduce((s, b) => s + b.overdue_count, 0)

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

  const handleSave = async (id: number, payload: UpdateAdvancePaymentPayload) => {
    await updateMutation.mutateAsync({ id, payload })
  }

  return (
    <div className="space-y-6">
      <PageHeader title="מקדמות" description="מעקב שנתי אחר תשלומים, פיגורים וגבייה" />

      <div className="flex items-center justify-between gap-4">
        <OverviewKPICards
          year={year}
          totalExpected={String(totalExpected)}
          totalPaid={String(totalPaid)}
          collectionRate={collectionRate}
          overdueCount={overdueTotal}
        />
        <div className="shrink-0 w-32">
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

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : batches.length === 0 ? (
        <p className="text-center text-gray-500 py-12">אין מקדמות לשנה {year}</p>
      ) : (
        <div className="space-y-2">
          {batches.map((batch) => (
            <AdvancePaymentBatchRow
              key={`${batch.year}-${batch.month}`}
              batch={batch}
              onRowClick={(row) => {
                if (isAdvisor) {
                  setDrawerRow(row)
                } else {
                  navigate(`/clients/${row.client_record_id}/advance-payments`)
                }
              }}
            />
          ))}
        </div>
      )}

      <AdvancePaymentDrawer
        row={drawerRow as never}
        open={drawerRow !== null}
        isUpdating={updateMutation.isPending}
        canEdit={isAdvisor}
        onClose={() => setDrawerRow(null)}
        onSave={handleSave}
      />
    </div>
  )
}
