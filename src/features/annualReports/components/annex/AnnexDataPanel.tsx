import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Plus, X } from "lucide-react";
import { annualReportsApi, annualReportsQK, type AnnualReportScheduleKey } from "../../api";
import { Button } from "../../../../components/ui/primitives/Button";
import {
  SCHEDULE_FIELDS,
  buildAnnexPayload,
  buildEmptyForm,
  mapLineDataToForm,
} from "../../annex.constants";
import { AnnexDataTable } from "./AnnexDataTable";

interface Props {
  reportId: number;
  schedule: AnnualReportScheduleKey;
  scheduleLabel: string;
}

export const AnnexDataPanel: React.FC<Props> = ({ reportId, schedule, scheduleLabel }) => {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingLineId, setEditingLineId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>(buildEmptyForm(schedule));

  const qk = annualReportsQK.annex(reportId, schedule);

  const { data: lines = [], isLoading } = useQuery({
    queryKey: qk,
    queryFn: () => annualReportsApi.getAnnexLines(reportId, schedule),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: qk });
    qc.invalidateQueries({ queryKey: annualReportsQK.readiness(reportId) });
  };

  const addMutation = useMutation({
    mutationFn: () => annualReportsApi.addAnnexLine(reportId, schedule, { data: buildAnnexPayload(schedule, formData) }),
    onSuccess: () => { invalidate(); setShowForm(false); setFormData(buildEmptyForm(schedule)); },
  });

  const updateMutation = useMutation({
    mutationFn: (lineId: number) =>
      annualReportsApi.updateAnnexLine(reportId, schedule, lineId, { data: buildAnnexPayload(schedule, formData) }),
    onSuccess: () => {
      invalidate();
      setEditingLineId(null);
      setFormData(buildEmptyForm(schedule));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (lineId: number) => annualReportsApi.deleteAnnexLine(reportId, schedule, lineId),
    onSuccess: invalidate,
  });

  const fields = SCHEDULE_FIELDS[schedule];

  if (isLoading) return <p className="text-xs text-gray-400 py-2">טוען...</p>;

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
          onFormChange={(key, value) => setFormData((prev) => ({ ...prev, [key]: value }))}
          onStartEdit={(line) => {
            setShowForm(false);
            setEditingLineId(line.id);
            setFormData(mapLineDataToForm(schedule, line.data as Record<string, unknown>));
          }}
          onCancelEdit={() => {
            setEditingLineId(null);
            setFormData(buildEmptyForm(schedule));
          }}
          onSaveEdit={(lineId) => updateMutation.mutate(lineId)}
          onDelete={(lineId) => deleteMutation.mutate(lineId)}
        />
      ) : null}

      {showForm ? (
        <div className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
          <p className="text-xs font-medium text-gray-600">הוסף שורה — {scheduleLabel}</p>
          <div className="grid grid-cols-2 gap-2">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="text-xs text-gray-500 block mb-0.5">{f.label}</label>
                <input
                  type={f.type === "date" ? "date" : f.type === "number" ? "number" : "text"}
                  value={formData[f.key]}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              <X className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => addMutation.mutate()}
              isLoading={addMutation.isPending}
            >
              <Check className="h-3.5 w-3.5 ml-1" />
              שמור
            </Button>
          </div>
        </div>
      ) : (
        <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-3.5 w-3.5 ml-1" />
          הוסף שורה
        </Button>
      )}
    </div>
  );
};

AnnexDataPanel.displayName = "AnnexDataPanel";
