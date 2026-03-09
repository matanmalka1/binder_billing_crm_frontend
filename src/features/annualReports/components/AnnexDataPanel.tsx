import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, X, Check } from "lucide-react";
import { annualReportsApi, type AnnualReportScheduleKey } from "../../../api/annualReports.api";
import { QK } from "../../../lib/queryKeys";
import { Button } from "../../../components/ui/Button";

interface Props {
  reportId: number;
  schedule: AnnualReportScheduleKey;
  scheduleLabel: string;
}

type FieldDef = { key: string; label: string; type: "text" | "number" | "date" };

const SCHEDULE_FIELDS: Record<AnnualReportScheduleKey, FieldDef[]> = {
  schedule_b: [
    { key: "property_address", label: "כתובת הנכס", type: "text" },
    { key: "gross_income", label: "הכנסה ברוטו", type: "number" },
    { key: "expenses", label: "הוצאות", type: "number" },
    { key: "net_income", label: "הכנסה נטו", type: "number" },
  ],
  schedule_bet: [
    { key: "asset_description", label: "תיאור הנכס", type: "text" },
    { key: "purchase_date", label: "תאריך רכישה", type: "date" },
    { key: "sale_date", label: "תאריך מכירה", type: "date" },
    { key: "purchase_price", label: "מחיר רכישה", type: "number" },
    { key: "sale_price", label: "מחיר מכירה", type: "number" },
    { key: "exempt_amount", label: "סכום פטור", type: "number" },
    { key: "taxable_gain", label: "רווח חייב", type: "number" },
  ],
  schedule_gimmel: [
    { key: "country", label: "מדינה", type: "text" },
    { key: "income_type", label: "סוג הכנסה", type: "text" },
    { key: "gross_amount", label: "סכום ברוטו", type: "number" },
    { key: "foreign_tax_paid", label: "מס זר ששולם", type: "number" },
    { key: "credit_claimed", label: "זיכוי נדרש", type: "number" },
  ],
  schedule_dalet: [
    { key: "asset_name", label: "שם הנכס", type: "text" },
    { key: "purchase_date", label: "תאריך רכישה", type: "date" },
    { key: "cost", label: "עלות", type: "number" },
    { key: "depreciation_rate", label: "שיעור פחת (%)", type: "number" },
    { key: "annual_depreciation", label: "פחת שנתי", type: "number" },
    { key: "accumulated", label: "פחת מצטבר", type: "number" },
  ],
  schedule_heh: [
    { key: "property_address", label: "כתובת הנכס", type: "text" },
    { key: "monthly_rent", label: "שכירות חודשית", type: "number" },
    { key: "annual_rent", label: "שכירות שנתית", type: "number" },
    { key: "exempt_ceiling", label: "תקרת פטור", type: "number" },
    { key: "taxable_portion", label: "חלק חייב", type: "number" },
  ],
};

function buildEmptyForm(schedule: AnnualReportScheduleKey): Record<string, string> {
  return Object.fromEntries(SCHEDULE_FIELDS[schedule].map((f) => [f.key, ""]));
}

export const AnnexDataPanel: React.FC<Props> = ({ reportId, schedule, scheduleLabel }) => {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>(buildEmptyForm(schedule));

  const qk = QK.tax.annualReportAnnex(reportId, schedule);

  const { data: lines = [], isLoading } = useQuery({
    queryKey: qk,
    queryFn: () => annualReportsApi.getAnnexLines(reportId, schedule),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: qk });
    qc.invalidateQueries({ queryKey: QK.tax.annualReportReadiness(reportId) });
  };

  const addMutation = useMutation({
    mutationFn: () => {
      const data: Record<string, unknown> = {};
      for (const f of SCHEDULE_FIELDS[schedule]) {
        data[f.key] = f.type === "number" ? parseFloat(formData[f.key] || "0") : formData[f.key];
      }
      return annualReportsApi.addAnnexLine(reportId, schedule, { data });
    },
    onSuccess: () => { invalidate(); setShowForm(false); setFormData(buildEmptyForm(schedule)); },
  });

  const deleteMutation = useMutation({
    mutationFn: (lineId: number) => annualReportsApi.deleteAnnexLine(reportId, schedule, lineId),
    onSuccess: invalidate,
  });

  const fields = SCHEDULE_FIELDS[schedule];

  if (isLoading) return <p className="text-xs text-gray-400 py-2">טוען...</p>;

  return (
    <div className="mt-3 space-y-2">
      {lines.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 border-b">
                {fields.map((f) => <th key={f.key} className="text-right py-1 px-2 font-medium">{f.label}</th>)}
                <th />
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.id} className="border-b border-gray-100 hover:bg-gray-50">
                  {fields.map((f) => (
                    <td key={f.key} className="py-1 px-2 text-gray-700">
                      {String((line.data as Record<string, unknown>)[f.key] ?? "")}
                    </td>
                  ))}
                  <td className="py-1 px-2">
                    <button
                      onClick={() => deleteMutation.mutate(line.id)}
                      disabled={deleteMutation.isPending}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
