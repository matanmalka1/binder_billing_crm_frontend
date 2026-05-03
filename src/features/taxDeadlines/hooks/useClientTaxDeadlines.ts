import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useRole } from '../../../hooks/useRole'
import { taxDeadlinesApi, taxDeadlinesQK } from '../api'
import { timelineQK } from '@/features/timeline'
import { getHttpStatus, showErrorToast } from '../../../utils/utils'
import { toast } from '../../../utils/toast'
import { DUPLICATE_TAX_DEADLINE_MESSAGE } from '../constants'
import { getCurrentTaxYear, toDeadlinePayloadPeriod, toDeadlinePayloadTaxYear } from '../utils'
import { useTaxDeadlineActions } from './useTaxDeadlineActions'
import type { CreateTaxDeadlineForm, GenerateTaxDeadlinesForm } from '../types'

const PAGE_SIZE = 100

export interface ClientDeadlineFilters {
  deadline_type: string
  status: string
  due_from: string
  due_to: string
}

const INITIAL_FILTERS: ClientDeadlineFilters = {
  deadline_type: '',
  status: '',
  due_from: '',
  due_to: '',
}

export const useClientTaxDeadlines = (clientId: number) => {
  const queryClient = useQueryClient()
  const { isAdvisor } = useRole()

  const [filters, setFilters] = useState<ClientDeadlineFilters>(INITIAL_FILTERS)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showGenerateModal, setShowGenerateModal] = useState(false)

  const invalidateAfterMutation = () => {
    queryClient.invalidateQueries({ queryKey: taxDeadlinesQK.all })
    queryClient.invalidateQueries({ queryKey: timelineQK.all })
  }

  const actions = useTaxDeadlineActions({ invalidateAfterMutation })

  const listParams = useMemo(
    () => ({
      client_record_id: clientId,
      deadline_type: filters.deadline_type || undefined,
      status: filters.status || undefined,
      due_from: filters.due_from || undefined,
      due_to: filters.due_to || undefined,
      page: 1,
      page_size: PAGE_SIZE,
    }),
    [clientId, filters],
  )

  const { data, isLoading, error } = useQuery({
    queryKey: taxDeadlinesQK.list(listParams),
    queryFn: () => taxDeadlinesApi.listTaxDeadlines(listParams),
  })

  const deadlines = useMemo(() => data?.items ?? [], [data?.items])

  const handleFilterChange = (key: keyof ClientDeadlineFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleResetFilters = () => setFilters(INITIAL_FILTERS)

  // Create form — client_id pre-set and locked
  const createForm = useForm<CreateTaxDeadlineForm>({
    defaultValues: {
      client_id: String(clientId),
      deadline_type: '',
      due_date: '',
      period: '',
      payment_amount: '',
      description: '',
    },
  })

  const createMutation = useMutation({
    mutationFn: (payload: {
      client_record_id: number
      deadline_type: string
      due_date?: string
      period?: string | null
      tax_year?: number | null
      payment_amount?: string | null
      description?: string | null
    }) => taxDeadlinesApi.createTaxDeadline(payload),
    onSuccess: () => {
      toast.success('מועד נוצר בהצלחה')
      invalidateAfterMutation()
      setShowCreateModal(false)
      createForm.reset({ client_id: String(clientId) })
    },
    onError: (error) => {
      if (getHttpStatus(error) === 409) {
        toast.error(DUPLICATE_TAX_DEADLINE_MESSAGE)
        return
      }
      showErrorToast(error, 'שגיאה ביצירת מועד')
    },
  })

  const onCreateSubmit = createForm.handleSubmit(async (values) => {
    const duplicate = await actions.findDuplicateDeadline(values)
    if (duplicate) {
      createForm.setError('period', { type: 'manual', message: DUPLICATE_TAX_DEADLINE_MESSAGE })
      toast.error(DUPLICATE_TAX_DEADLINE_MESSAGE)
      return
    }
    await createMutation.mutateAsync({
      client_record_id: clientId,
      deadline_type: values.deadline_type,
      due_date: values.deadline_type === 'vat' ? undefined : values.due_date,
      period: toDeadlinePayloadPeriod(values),
      tax_year: toDeadlinePayloadTaxYear(values),
      payment_amount: values.payment_amount ? values.payment_amount : null,
      description: values.description || null,
    })
  })

  // Generate form — client_id pre-set and locked
  const generateForm = useForm<GenerateTaxDeadlinesForm>({
    defaultValues: {
      client_id: String(clientId),
      year: String(getCurrentTaxYear()),
    },
  })

  const generateMutation = useMutation({
    mutationFn: (payload: { client_record_id: number; year: number }) =>
      taxDeadlinesApi.generateDeadlines(payload),
    onSuccess: ({ created_count }) => {
      if (created_count > 0) {
        toast.success(`נוצרו ${created_count} מועדים בהצלחה`)
      } else {
        toast.success('לא נוצרו מועדים חדשים')
      }
      invalidateAfterMutation()
      setShowGenerateModal(false)
    },
    onError: (error) => showErrorToast(error, 'שגיאה ביצירת מועדים אוטומטית'),
  })

  const onGenerateSubmit = generateForm.handleSubmit(async (values) => {
    await generateMutation.mutateAsync({
      client_record_id: clientId,
      year: Number(values.year),
    })
    generateForm.reset({ client_id: String(clientId), year: values.year })
  })

  return {
    deadlines,
    filters,
    isLoading,
    error,
    isAdvisor,
    isCreating: createMutation.isPending,
    isGenerating: generateMutation.isPending,
    showCreateModal,
    showGenerateModal,
    setShowCreateModal,
    setShowGenerateModal,
    handleFilterChange,
    handleResetFilters,
    createForm,
    onCreateSubmit,
    generateForm,
    onGenerateSubmit,
    // actions
    ...actions,
  }
}
