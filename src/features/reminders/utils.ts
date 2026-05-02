import type { CreateReminderRequest, Reminder, ReminderType } from './api'
import { createReminderDefaultValues, type CreateReminderFormValues } from './schemas'
import { reminderTypeLabels } from './types'

export type ReminderClientGroup = {
  key: string
  clientRecordId: number | null
  clientName: string
  officeClientNumber: number | null
  clientIdNumber: string | null
  reminders: Reminder[]
}

export const makeReminderFormDefaults = (clientRecordId?: number): CreateReminderFormValues => ({
  ...createReminderDefaultValues,
  client_record_id: clientRecordId ? String(clientRecordId) : '',
})

const toOptionalNumber = (value?: string) => (value ? Number(value) : undefined)

export const buildReminderPayload = (
  values: CreateReminderFormValues,
  fixedClientRecordId?: number,
): CreateReminderRequest => {
  const clientRecordId = fixedClientRecordId ?? Number(values.client_record_id)
  const businessId = toOptionalNumber(values.business_id)
  const scheduling = {
    target_date: values.target_date,
    days_before: values.days_before,
    message: values.message || undefined,
  }

  switch (values.reminder_type) {
    case 'binder_idle':
      return {
        ...scheduling,
        reminder_type: values.reminder_type,
        binder_id: Number(values.binder_id),
      }
    case 'document_missing':
      return {
        ...scheduling,
        reminder_type: values.reminder_type,
        business_id: businessId as number,
      }
    case 'custom':
      return {
        ...scheduling,
        reminder_type: values.reminder_type,
        client_record_id: clientRecordId,
        business_id: businessId,
        message: values.message,
      }
  }
}

export const hasDuplicateReminder = (
  reminders: Reminder[],
  values: CreateReminderFormValues,
  fixedClientRecordId?: number,
) => {
  const clientRecordId = fixedClientRecordId ?? Number(values.client_record_id)

  return reminders.some(
    (reminder) =>
      reminder.client_record_id === clientRecordId &&
      reminder.reminder_type === values.reminder_type &&
      reminder.target_date === values.target_date,
  )
}

export const filterReminders = (reminders: Reminder[], search: string, typeFilter: string) => {
  const query = search.trim().toLowerCase()

  return reminders.filter((reminder) => {
    const matchesSearch =
      !query ||
      [
        reminder.client_name,
        reminder.business_name,
        reminder.client_id_number,
        reminder.office_client_number?.toString(),
        reminder.message,
      ].some((value) => value?.toLowerCase().includes(query))

    return matchesSearch && (!typeFilter || reminder.reminder_type === typeFilter)
  })
}

export const getReminderDisplayLabel = (reminder: Reminder) =>
  reminder.display_label ??
  reminderTypeLabels[reminder.reminder_type as ReminderType] ??
  reminder.reminder_type

const getReminderClientKey = (reminder: Reminder) => {
  if (reminder.client_record_id != null) return `client:${reminder.client_record_id}`
  if (reminder.office_client_number != null) return `office:${reminder.office_client_number}`
  if (reminder.client_id_number) return `id:${reminder.client_id_number}`
  return `unknown:${reminder.client_name ?? 'no-client'}`
}

export const groupRemindersByClient = (reminders: Reminder[]) => {
  const groups = new Map<string, ReminderClientGroup>()

  reminders.forEach((reminder) => {
    const key = getReminderClientKey(reminder)
    const current = groups.get(key)

    if (current) {
      current.reminders.push(reminder)
      return
    }

    groups.set(key, {
      key,
      clientRecordId: reminder.client_record_id,
      clientName: reminder.client_name ?? 'ללא שם לקוח',
      officeClientNumber: reminder.office_client_number,
      clientIdNumber: reminder.client_id_number,
      reminders: [reminder],
    })
  })

  return Array.from(groups.values())
}
