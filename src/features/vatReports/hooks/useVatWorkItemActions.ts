import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { vatReportsApi } from '../api'
import { toast } from '../../../utils/toast'
import { showErrorToast } from '../../../utils/utils'
import { invalidateVatWorkItem } from './useVatInvalidation'

export const useVatWorkItemActions = (workItemId: number) => {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)

  const run = async (
    fn: () => ReturnType<typeof vatReportsApi.markMaterialsComplete>,
    successMsg: string,
    errMsg: string,
  ) => {
    setLoading(true)
    try {
      const workItem = await fn()
      toast.success(successMsg)
      await invalidateVatWorkItem(queryClient, {
        workItemId: workItem.id,
        clientRecordId: workItem.client_record_id,
      })
    } catch (err) {
      showErrorToast(err, errMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleMaterialsComplete = () =>
    run(() => vatReportsApi.markMaterialsComplete(workItemId), 'קבלת החומרים אושרה', 'שגיאה בשינוי סטטוס')

  const handleReadyForReview = () =>
    run(() => vatReportsApi.markReadyForReview(workItemId), 'התיק נשלח לבדיקה', 'שגיאה בשינוי סטטוס')

  const handleSendBack = (note: string) =>
    run(() => vatReportsApi.sendBack(workItemId, note), 'התיק הוחזר לתיקון', 'שגיאה בהחזרה לתיקון')

  return { handleMaterialsComplete, handleReadyForReview, handleSendBack, isLoading: loading }
}
