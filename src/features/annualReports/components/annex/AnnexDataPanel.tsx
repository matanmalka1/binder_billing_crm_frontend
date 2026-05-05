import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, Plus, X } from 'lucide-react'
import { annualReportsApi, annualReportsQK, type AnnualReportScheduleKey } from '../../api'
import { showErrorToast } from '../../../../utils/utils'
import { Button } from '../../../../components/ui/primitives/Button'
import { Input } from '../../../../components/ui/inputs/Input'
import { SCHEDULE_FIELDS, buildAnnexPayload, buildEmptyForm, mapLineDataToForm } from '../../annex.constants'
import { AnnexDataTable } from './AnnexDataTable'
import { ANNEX_TEXT, FIELD_INPUT_CLASS, TABLE_ICON_CLASS } from './annex.constants'
import { getInputType } from './annex.helpers'

interface Props {
  reportId: number
  schedule: AnnualReportScheduleKey
  scheduleLabel: string
}

export const AnnexDataPanel: React.FC<Props> = ({ reportId, schedule, scheduleLabel }) => {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingLineId, setEditingLineId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>(buildEmptyForm(schedule))

  const qk = annualReportsQK.annex(reportId, schedule)

  const { data: annexData, isLoading } = useQuery({
    queryKey: qk,
    queryFn: () => annualReportsApi.getAnnexLines(reportId, schedule),
  })
  const lines = annexData?.items ?? []

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: qk })
    qc.invalidateQueries({ queryKey: annualReportsQK.readiness(reportId) })
  }

  const addMutation = useMutation({
    mutationFn: () =>
      annualReportsApi.addAnnexLine(reportId, schedule, {
        data: buildAnnexPayload(schedule, formData),
      }),
    onSuccess: () => {
      invalidate()
      setShowForm(false)
      setFormData(buildEmptyForm(schedule))
    },
    onError: (err) => showErrorToast(err, 'שגיאה בהוספת שורה'),
  })

  const updateMutation = useMutation({
    mutationFn: (lineId: number) =>
      annualReportsApi.updateAnnexLine(reportId, schedule, lineId, {
        data: buildAnnexPayload(schedule, formData),
      }),
    onSuccess: () => {
      invalidate()
      setEditingLineId(null)
      setFormData(buildEmptyForm(schedule))
    },
    onError: (err) => showErrorToast(err, 'שגיאה בעדכון שורה'),
  })

  const deleteMutation = useMutation({
    mutationFn: (lineId: number) => annualReportsApi.deleteAnnexLine(reportId, schedule, lineId),
    onSuccess: invalidate,
    onError: (err) => showErrorToast(err, 'שגיאה במחיקת שורה'),
  })

  const fields = SCHEDULE_FIELDS[schedule]
  const resetForm = () => setFormData(buildEmptyForm(schedule))
  const handleFormChange = (key: string, value: string) => setFormData((prev) => ({ ...prev, [key]: value }))

  if (isLoading) return <p className="text-xs text-gray-400 py-2">{ANNEX_TEXT.loading}</p>

  return (
    <div className="mt-3 space-y-2">
      {lines.length > 0 ? (
        <AnnexDataTable
          lines={lines}
          fields={fields}
          editingLineId={editingLineId}
          formData={formData}
          isUpdating={updateMutation.isPending}
          isDeleting={deleteMutation.isPending}
          onFormChange={handleFormChange}
          onStartEdit={(line) => {
            setShowForm(false)
            setEditingLineId(line.id)
            setFormData(mapLineDataToForm(schedule, line.data as Record<string, unknown>))
          }}
          onCancelEdit={() => {
            setEditingLineId(null)
            resetForm()
          }}
          onSaveEdit={(lineId) => updateMutation.mutate(lineId)}
          onDelete={(lineId) => deleteMutation.mutate(lineId)}
        />
      ) : null}

      {showForm ? (
        <div className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
          <p className="text-xs font-medium text-gray-600">
            {ANNEX_TEXT.addLine} - {scheduleLabel}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="text-xs text-gray-500 block mb-0.5">{f.label}</label>
                <Input
                  type={getInputType(f.type)}
                  value={formData[f.key]}
                  onChange={(e) => handleFormChange(f.key, e.target.value)}
                  className={FIELD_INPUT_CLASS}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              <X className={TABLE_ICON_CLASS} />
            </Button>
            <Button type="button" size="sm" onClick={() => addMutation.mutate()} isLoading={addMutation.isPending}>
              <Check className={`${TABLE_ICON_CLASS} ml-1`} />
              {ANNEX_TEXT.save}
            </Button>
          </div>
        </div>
      ) : (
        <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(true)}>
          <Plus className={`${TABLE_ICON_CLASS} ml-1`} />
          {ANNEX_TEXT.addLine}
        </Button>
      )}
    </div>
  )
}

AnnexDataPanel.displayName = 'AnnexDataPanel'
