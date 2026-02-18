import { useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";
import type { AnnualReportFull, AnnualReportStatus, StatusTransitionPayload } from "../../../api/annualReports.extended.api";
import {
  getStatusLabel,
  getStatusVariant,
  getAllowedTransitions,
} from "../../../api/annualReports.extended.utils";

interface Props {
  report: AnnualReportFull;
  onTransition: (payload: StatusTransitionPayload) => void;
  isLoading: boolean;
}

const needsExtra = (status: AnnualReportStatus) =>
  status === "submitted" || status === "assessment_issued";

export const StatusTransitionPanel: React.FC<Props> = ({ report, onTransition, isLoading }) => {
  const allowed = getAllowedTransitions(report.status);
  const [selected, setSelected] = useState<AnnualReportStatus | null>(null);
  const [note, setNote] = useState("");
  const [itaRef, setItaRef] = useState("");
  const [assessmentAmount, setAssessmentAmount] = useState("");
  const [refundDue, setRefundDue] = useState("");
  const [taxDue, setTaxDue] = useState("");

  if (allowed.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
        אין מעברי סטטוס זמינים (הדוח {getStatusLabel(report.status)})
      </div>
    );
  }

  const handleSubmit = () => {
    if (!selected) return;
    const payload: StatusTransitionPayload = {
      status: selected,
      note: note || null,
      ita_reference: itaRef || null,
      assessment_amount: assessmentAmount ? Number(assessmentAmount) : null,
      refund_due: refundDue ? Number(refundDue) : null,
      tax_due: taxDue ? Number(taxDue) : null,
    };
    onTransition(payload);
    setSelected(null);
    setNote("");
    setItaRef("");
    setAssessmentAmount("");
    setRefundDue("");
    setTaxDue("");
  };

  return (
    <Card title="מעבר סטטוס">
      <div className="space-y-4">
        {/* Current status */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>סטטוס נוכחי:</span>
          <Badge variant={getStatusVariant(report.status)}>{getStatusLabel(report.status)}</Badge>
        </div>

        {/* Transition buttons */}
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">מעבר ל:</p>
          <div className="flex flex-wrap gap-2">
            {allowed.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelected(selected === s ? null : s)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                  selected === s
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                    : "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/50"
                }`}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {getStatusLabel(s)}
              </button>
            ))}
          </div>
        </div>

        {/* Extra fields for specific transitions */}
        {selected && (
          <div className="space-y-3 rounded-lg border border-blue-100 bg-blue-50/30 p-4 animate-fade-in">
            <Input
              label="הערה (אופציונלי)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="הערה על המעבר..."
            />

            {selected === "submitted" && (
              <Input
                label="מספר אסמכתא (ITA)"
                value={itaRef}
                onChange={(e) => setItaRef(e.target.value)}
                placeholder="מספר אסמכתא ממס הכנסה"
              />
            )}

            {selected === "assessment_issued" && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Input
                  label="סכום שומה (₪)"
                  type="number"
                  value={assessmentAmount}
                  onChange={(e) => setAssessmentAmount(e.target.value)}
                />
                <Input
                  label="החזר מס (₪)"
                  type="number"
                  value={refundDue}
                  onChange={(e) => setRefundDue(e.target.value)}
                />
                <Input
                  label="תשלום נוסף (₪)"
                  type="number"
                  value={taxDue}
                  onChange={(e) => setTaxDue(e.target.value)}
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
