import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { taxDeadlinesApi } from '../api'
import type { TaxDeadlineResponse } from '../api'
import type { CreateTaxDeadlineForm, EditTaxDeadlineForm } from '../types'
import { getHttpStatus, showErrorToast } from '../../../utils/utils'
import { toast } from '../../../utils/toast'
import { DUPLICATE_TAX_DEADLINE_MESSAGE } from '../constants'
import {
  findMatchingDuplicateDeadline,
  isAnnualReportDeadline,
  toDeadlinePayloadPeriod,
  toDeadlinePayloadTaxYear,
} from '../utils'

interface UseTaxDeadlineActionsParams {
  invalidateAfterMutation: () => void
}

export const useTaxDeadlineActions = ({ invalidateAfterMutation }: UseTaxDeadlineActionsParams) => {
  const [completingId, setCompletingId] = useState<number | null>(null)
  const [reopeningId, setReopeningId] = useState<number | null>(null)
  const [editingDeadline, setEditingDeadline] = useState<TaxDeadlineResponse | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const editForm = useForm<EditTaxDeadlineForm>({
    defaultValues: {
      deadline_type: '',
      due_date: '',
      period: '',
      payment_amount: '',
      description: '',
    },
  })

  const findDuplicateDeadline = async (
    values: Pick<CreateTaxDeadlineForm, 'client_id' | 'deadline_type' | 'period'>,
    excludeId?: number,
  ): Promise<TaxDeadlineResponse | null> => {
    if (!isAnnualReportDeadline(values.deadline_type) && !values.period) return null
    const response = await taxDeadlinesApi.listTaxDeadlines({
      client_record_id: Number(values.client_id),
      deadline_type: values.deadline_type,
      period: isAnnualReportDeadline(values.deadline_type) ? undefined : values.period,
      page: 1,
      page_size: 5,
    })
    return findMatchingDuplicateDeadline(response.items, values, excludeId)
  }

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: {
        deadline_type?: string
        due_date?: string
        period?: string | null
        tax_year?: number | null
        payment_amount?: string | null
        description?: string | null
      }
    }) => taxDeadlinesApi.updateTaxDeadline(id, payload),
    onSuccess: () => {
      toast.success('מועד עודכן בהצלחה')
      invalidateAfterMutation()
      setEditingDeadline(null)
    },
    onError: (error) => {
      if (getHttpStatus(error) === 409) {
        toast.error(DUPLICATE_TAX_DEADLINE_MESSAGE)
        return
      }
      showErrorToast(error, 'שגיאה בעדכון מועד')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (deadlineId: number) => taxDeadlinesApi.deleteTaxDeadline(deadlineId),
    onSuccess: () => {
      toast.success('מועד נמחק בהצלחה')
      invalidateAfterMutation()
    },
    onError: (error) => showErrorToast(error, 'שגיאה במחיקת מועד'),
    onSettled: () => setDeletingId(null),
  })

  const completeMutation = useMutation({
    mutationFn: (deadlineId: number) => taxDeadlinesApi.completeTaxDeadline(deadlineId),
    onSuccess: () => {
      toast.success('מועד סומן כהושלם')
      invalidateAfterMutation()
    },
    onError: (error) => showErrorToast(error, 'שגיאה בסימון מועד'),
    onSettled: () => setCompletingId(null),
  })

  const reopenMutation = useMutation({
    mutationFn: (deadlineId: number) => taxDeadlinesApi.reopenTaxDeadline(deadlineId),
    onSuccess: () => {
      toast.success('מועד הוחזר לממתין')
      invalidateAfterMutation()
    },
    onError: (error) => showErrorToast(error, 'שגיאה בהחזרת המועד'),
    onSettled: () => setReopeningId(null),
  })

  const handleComplete = async (deadlineId: number) => {
    setCompletingId(deadlineId)
    await completeMutation.mutateAsync(deadlineId)
  }

  const handleReopen = async (deadlineId: number) => {
    setReopeningId(deadlineId)
    await reopenMutation.mutateAsync(deadlineId)
  }

  const handleEdit = (deadline: TaxDeadlineResponse) => {
    setEditingDeadline(deadline)
    editForm.reset({
      deadline_type: deadline.deadline_type,
      due_date: deadline.due_date,
      period:
        deadline.deadline_type === 'annual_report'
          ? String(deadline.tax_year ?? '')
          : (deadline.period ?? ''),
      payment_amount: deadline.payment_amount != null ? String(deadline.payment_amount) : '',
      description: deadline.description ?? '',
    })
  }

  const handleDelete = (deadlineId: number) => {
    setDeletingId(deadlineId)
    deleteMutation.mutate(deadlineId)
  }

  const onEditSubmit = editForm.handleSubmit(async (values) => {
    if (!editingDeadline) return
    const duplicate = await findDuplicateDeadline(
      { ...values, client_id: String(editingDeadline.client_record_id) },
      editingDeadline.id,
    )
    if (duplicate) {
      editForm.setError('period', { type: 'manual', message: DUPLICATE_TAX_DEADLINE_MESSAGE })
      toast.error(DUPLICATE_TAX_DEADLINE_MESSAGE)
      return
    }
    await updateMutation.mutateAsync({
      id: editingDeadline.id,
      payload: {
        deadline_type: values.deadline_type || undefined,
        due_date: values.deadline_type === 'vat' ? undefined : values.due_date || undefined,
        period: toDeadlinePayloadPeriod(values),
        tax_year: toDeadlinePayloadTaxYear(values),
        payment_amount: values.payment_amount ? values.payment_amount : null,
        description: values.description || null,
      },
    })
    editForm.reset()
  })

  return {
    completingId,
    reopeningId,
    deletingId,
    editingDeadline,
    editForm,
    isUpdating: updateMutation.isPending,
    findDuplicateDeadline,
    setEditingDeadline,
    handleComplete,
    handleReopen,
    handleEdit,
    handleDelete,
    onEditSubmit,
  }
}
