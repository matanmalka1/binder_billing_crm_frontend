import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";
import type {
  AnnualReportFull,
  AnnualReportStatus,
  StatusTransitionPayload,
} from "../../../api/annualReports.api";
import {
  getStatusLabel,
  getStatusVariant,
  getAllowedTransitions,
} from "../../../api/annualReports.extended.utils";
import { cn } from "../../../utils/utils";

interface StatusTransitionPanelProps {
  report: AnnualReportFull;
  onTransition: (payload: StatusTransitionPayload) => void;
  isLoading: boolean;
}

interface TransitionForm {
  note: string;
  itaRef: string;
  assessmentAmount: string;
  refundDue: string;
  taxDue: string;
}

const EMPTY_FORM: TransitionForm = {
  note: "",
  itaRef: "",
  assessmentAmount: "",
  refundDue: "",
  taxDue: "",
};

export const StatusTransitionPanel: React.FC<StatusTransitionPanelProps> = ({
  report,
  onTransition,
  isLoading,
}) => {
  const allowed = getAllowedTransitions(report.status);
  const [selected, setSelected] = useState<AnnualReportStatus | null>(null);
  const [form, setForm] = useState<TransitionForm>(EMPTY_FORM);

  if (allowed.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
        אין מעברי סטטוס זמינים (הדוח {getStatusLabel(report.status)})
      </div>
    );
  }

  const setField = (field: keyof TransitionForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSelect = (status: AnnualReportStatus) => {
    setSelected((prev) => (prev === status ? null : status));
    setForm(EMPTY_FORM);
  };

  const handleSubmit = () => {
    if (!selected) return;
    onTransition({
      status: selected,
      note: form.note || null,
      ita_reference: form.itaRef || null,
      assessment_amount: form.assessmentAmount ? Number(form.assessmentAmount) : null,
      refund_due: form.refundDue ? Number(form.refundDue) : null,
      tax_due: form.taxDue ? Number(form.taxDue) : null,
    });
    setSelected(null);
    setForm(EMPTY_FORM);
  };

  return (
    <Card title="מעבר סטטוס">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>סטטוס נוכחי:</span>
          <Badge variant={getStatusVariant(report.status)}>{getStatusLabel(report.status)}</Badge>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">מעבר ל:</p>
          <div className="flex flex-wrap gap-2">
            {allowed.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSelect(s)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                  selected === s
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                    : "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/50",
                )}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {getStatusLabel(s)}
              </button>
            ))}
          </div>
        </div>

        {selected && (
          <div className="space-y-3 rounded-lg border border-blue-100 bg-blue-50/30 p-4 animate-fade-in">
            <Input
              label="הערה (אופציונלי)"
              value={form.note}
              onChange={setField("note")}
              placeholder="הערה על המעבר..."
            />

            {selected === "submitted" && (
              <Input
                label="מספר אסמכתא (ITA)"
                value={form.itaRef}
                onChange={setField("itaRef")}
                placeholder="מספר אסמכתא ממס הכנסה"
              />
            )}

            {selected === "assessment_issued" && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Input
                  label="סכום שומה (₪)"
                  type="number"
                  value={form.assessmentAmount}
                  onChange={setField("assessmentAmount")}
                />
                <Input
                  label="החזר מס (₪)"
                  type="number"
                  value={form.refundDue}
                  onChange={setField("refundDue")}
                />
                <Input
                  label="תשלום נוסף (₪)"
                  type="number"
                  value={form.taxDue}
                  onChange={setField("taxDue")}
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelected(null)}
              >
                ביטול
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                isLoading={isLoading}
              >
                אישור מעבר ל{getStatusLabel(selected)}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};