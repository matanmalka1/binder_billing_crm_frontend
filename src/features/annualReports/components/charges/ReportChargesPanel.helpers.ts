import { PAGE_SIZE_SM } from '@/constants/pagination.constants'

export const REPORT_CHARGES_TEXT = {
  loading: 'טוען חיובים...',
  empty: 'לא נמצאו חיובים המקושרים לדוח זה',
  total: (count: number) => `סה"כ ${count} חיובים (מידע בלבד)`,
  previous: 'הקודם',
  next: 'הבא',
  missingDescription: '—',
}

export const REPORT_CHARGES_TABLE_HEADERS = ['תיאור', 'סכום', 'סטטוס', 'תאריך יצירה']

export const getReportChargesTotalPages = (total: number) => Math.ceil(total / PAGE_SIZE_SM)

export const formatChargeCreatedAt = (createdAt: string) =>
  new Date(createdAt).toLocaleDateString('he-IL')
