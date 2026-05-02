import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AdvancePaymentRow, AdvancePaymentStatus, UpdateAdvancePaymentPayload } from '../types'
import { useAdvancePayments } from '../hooks/useAdvancePayments'
import { useAdvanceRateInsights } from '../hooks/useAdvanceRateInsights'
import { useRole } from '../../../hooks/useRole'
import { advancePaymentsApi, advancedPaymentsQK } from '../api'
import { toast } from '../../../utils/toast'
import { getHttpStatus, showErrorToast } from '../../../utils/utils'
import { ClientAdvancePaymentsHeader } from './ClientAdvancePaymentsHeader'
import { AdvancePaymentTable } from './AdvancePaymentTable'
import { AdvancePaymentsKPICards } from './AdvancePaymentsKPICards'
import { AdvancePaymentDrawer } from './AdvancePaymentDrawer'
import { CreateAdvancePaymentModal } from './CreateAdvancePaymentModal'
import { PaginationCard } from '../../../components/ui/table/PaginationCard'
import { CLIENT_ADVANCE_PAYMENT_PAGE_SIZE } from './advancePaymentComponent.constants'
import { getTotalPages, toggleAdvancePaymentStatusFilter } from './advancePaymentComponent.utils'

interface ClientAdvancePaymentsTabProps {
  clientId: number
}

export const ClientAdvancePaymentsTab: React.FC<ClientAdvancePaymentsTabProps> = ({ clientId }) => {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const [statusFilter, setStatusFilter] = useState<AdvancePaymentStatus[]>([])
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerRow, setDrawerRow] = useState<AdvancePaymentRow | null>(null)
  const [generationFrequency, setGenerationFrequency] = useState<1 | 2>(1)
  const { isAdvisor } = useRole()

  const queryClient = useQueryClient()
  const {
    rows,
    isLoading,
    total,
    create,
    isCreating,
    deleteRow,
  } = useAdvancePayments(clientId, year, statusFilter, page)
  const { vatType, advanceRate } = useAdvanceRateInsights(clientId)

  useEffect(() => {
    if (vatType === 'bimonthly') setGenerationFrequency(2)
    else if (vatType === 'monthly') setGenerationFrequency(1)
  }, [vatType])

  const generateMutation = useMutation({
    mutationFn: () => advancePaymentsApi.generateSchedule(clientId, year, generationFrequency),
    onSuccess: (data) => {
      const msg = data.created > 0 ? `נוצרו ${data.created} מקדמות` : 'הכול קיים'
      toast.success(msg)
      void queryClient.invalidateQueries({
        queryKey: advancedPaymentsQK.forClientYear(clientId, year),
      })
    },
    onError: (err) => showErrorToast(err, 'שגיאה ביצירת לוח מקדמות'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAdvancePaymentPayload }) =>
      advancePaymentsApi.update(clientId, id, payload),
    onSuccess: () => {
      toast.success('מקדמה עודכנה בהצלחה')
      void queryClient.invalidateQueries({ queryKey: advancedPaymentsQK.forClientYear(clientId, year) })
      setDrawerRow(null)
    },
    onError: (err) => showErrorToast(err, 'שגיאה בעדכון מקדמה'),
  })

  const totalPages = getTotalPages(total, CLIENT_ADVANCE_PAYMENT_PAGE_SIZE)

  const handleStatusToggle = (status: AdvancePaymentStatus) => {
    setPage(1)
    setStatusFilter((prev) => toggleAdvancePaymentStatusFilter(prev, status))
  }

  const handleSave = async (id: number, payload: UpdateAdvancePaymentPayload) => {
    await updateMutation.mutateAsync({ id, payload })
  }

  const handleCreate = async (...args: Parameters<typeof create>) => {
    try {
      const result = await create(...args)
      toast.success('מקדמה נוצרה בהצלחה')
      return result
    } catch (err) {
      if (getHttpStatus(err) === 409) {
        toast.error('מקדמה לחודש זה כבר קיימת')
      } else {
        showErrorToast(err, 'שגיאה ביצירת מקדמה')
      }
      throw err
    }
  }

  const handleDeleteRow = async (id: number) => {
    try {
      await deleteRow(id)
      toast.success('מקדמה נמחקה בהצלחה')
    } catch (err) {
      showErrorToast(err, 'שגיאה במחיקת מקדמה')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <ClientAdvancePaymentsHeader
          isAdvisor={isAdvisor}
          statusFilter={statusFilter}
          onToggleStatus={handleStatusToggle}
          year={year}
          onYearChange={(nextYear) => {
            setPage(1)
            setYear(nextYear)
          }}
          onOpenCreate={() => setModalOpen(true)}
          onGenerateSchedule={() => generateMutation.mutate()}
          generationFrequency={generationFrequency}
          onGenerationFrequencyChange={setGenerationFrequency}
          isGenerating={generateMutation.isPending}
        />
        {advanceRate != null && (
          <span className="text-sm text-gray-500 shrink-0">
            אחוז מקדמות:{' '}
            <span className="font-semibold text-gray-800">{advanceRate}%</span>
          </span>
        )}
      </div>

      <AdvancePaymentsKPICards clientId={clientId} year={year} />

      <AdvancePaymentTable
        rows={rows}
        isLoading={isLoading}
        canEdit={false}
        onRowClick={(row) => setDrawerRow(row)}
      />

      {totalPages > 1 && (
        <PaginationCard
          page={page}
          totalPages={totalPages}
          total={total}
          label="מקדמות"
          onPageChange={setPage}
        />
      )}

      <AdvancePaymentDrawer
        row={drawerRow}
        open={drawerRow !== null}
        isUpdating={updateMutation.isPending}
        canEdit={isAdvisor}
        onClose={() => setDrawerRow(null)}
        onSave={handleSave}
      />

      {isAdvisor && (
        <CreateAdvancePaymentModal
          open={modalOpen}
          clientId={clientId}
          year={year}
          isCreating={isCreating}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  )
}
