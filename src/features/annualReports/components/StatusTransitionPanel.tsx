import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";
import { Textarea } from "../../../components/ui/Textarea";
import { Modal } from "../../../components/ui/Modal";
import type {
  AnnualReportFull,
  AnnualReportStatus,
  StatusTransitionPayload,
} from "../../../api/annualReports.api";
import { annualReportsApi } from "../../../api/annualReports.api";
import { annualReportTaxApi } from "../../../api/annualReportTax.api";
import {
  getStatusLabel,
  getStatusVariant,
  getAllowedTransitions,
} from "../../../api/annualReports.extended.utils";
import { cn, showErrorToast } from "../../../utils/utils";
import { type TransitionForm, EMPTY_FORM } from "../utils";
import { QK } from "../../../lib/queryKeys";
import { toast } from "../../../utils/toast";

interface StatusTransitionPanelProps {
  report: AnnualReportFull;
  onTransition: (payload: StatusTransitionPayload) => void;
  isLoading: boolean;
}

export const StatusTransitionPanel: React.FC<StatusTransitionPanelProps> = ({
  report,
  onTransition,
  isLoading,
}) => {
  const queryClient = useQueryClient();
  const allowed = getAllowedTransitions(report.status);
  const [selected, setSelected] = useState<AnnualReportStatus | null>(null);
  const [form, setForm] = useState<TransitionForm>(EMPTY_FORM);
  const [amendOpen, setAmendOpen] = useState(false);
  const [amendReason, setAmendReason] = useState("");

  const amendMutation = useMutation({
    mutationFn: (reason: string) => annualReportsApi.amend(report.id, reason),
    onSuccess: () => {
      toast.success("דוח נשלח לתיקון");
      queryClient.invalidateQueries({ queryKey: QK.tax.annualReports.detail(report.id) });
      setAmendOpen(false);
      setAmendReason("");
    },
    onError: (err) => showErrorToast(err, "שגיאה בשליחת תיקון"),
  });

  const handleAmendSubmit = () => {
    if (amendReason.trim().length < 10) return;
    amendMutation.mutate(amendReason.trim());
  };

  const canSubmit = allowed.includes("submitted");
  const { data: readiness } = useQuery({
    queryKey: QK.tax.annualReportReadiness(report.id),
    queryFn: () => annualReportTaxApi.getReadiness(report.id),
    enabled: canSubmit,
  });

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
    <>
      <Modal
        open={amendOpen}
        title="תיקון דוח"
        onClose={() => { setAmendOpen(false); setAmendReason(""); }}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => { setAmendOpen(false); setAmendReason(""); }}>
              ביטול
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleAmendSubmit}
              isLoading={amendMutation.isPending}
              disabled={amendReason.trim().length < 10}
            >
              שלח
            </Button>
          </div>
        }
      >
        <Textarea
          label="סיבת תיקון *"
          rows={4}
          value={amendReason}
          onChange={(e) => setAmendReason(e.target.value)}
          placeholder="תאר את סיבת התיקון (לפחות 10 תווים)..."
        />
        {amendReason.trim().length > 0 && amendReason.trim().length < 10 && (
          <p className="mt-1 text-xs text-red-500">נדרשים לפחות 10 תווים</p>
        )}
      </Modal>

    <Card title="מעבר סטטוס">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>סטטוס נוכחי:</span>
            <Badge variant={getStatusVariant(report.status)}>{getStatusLabel(report.status)}</Badge>
          </div>
          {report.status === "submitted" && (
            <Button type="button" variant="outline" size="sm" onClick={() => setAmendOpen(true)}>
              תיקון דוח
            </Button>
          )}
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
                    ? "border-primary-500 bg-primary-50 text-primary-700 shadow-sm"
                    : "border-gray-300 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50/50",
                )}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {getStatusLabel(s)}
              </button>
            ))}
          </div>
        </div>

        {selected && (
          <div className="space-y-3 rounded-lg border border-primary-100 bg-primary-50/30 p-4 animate-fade-in">
            <Input
              label="הערה (אופציונלי)"
              value={form.note}
              onChange={setField("note")}
              placeholder="הערה על המעבר..."
            />

            {selected === "submitted" && readiness && !readiness.is_ready && (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-sm font-medium text-amber-700">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>הדוח אינו מוכן להגשה — הגשה תיחסם על ידי השרת</span>
                </div>
                <ul className="space-y-0.5 pr-5 list-disc text-xs text-amber-700">
                  {readiness.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                </ul>
              </div>
            )}

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
    </>
  );
};
