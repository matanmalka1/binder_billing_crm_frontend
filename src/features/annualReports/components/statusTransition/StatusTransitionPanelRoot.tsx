import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { annualReportsApi } from "../../api";
import {
  getAllowedTransitions,
  annualReportsQK,
  getStatusLabel,
  getStatusVariant,
} from "../../api";
import { Badge } from "../../../../components/ui/primitives/Badge";
import { Button } from "../../../../components/ui/primitives/Button";
import { Card } from "../../../../components/ui/primitives/Card";
import { toast } from "../../../../utils/toast";
import { showErrorToast } from "../../../../utils/utils";
import { EMPTY_FORM } from "../../utils";
import type { StatusTransitionPanelProps, TransitionForm } from "../../types";
import { AmendReportModal } from "./AmendReportModal";
import { TransitionDetailsForm } from "./TransitionDetailsForm";
import { TransitionTargetSelector } from "./TransitionTargetSelector";
import { ReadinessCheckPanel } from "../panel/ReadinessCheckPanel";

export const StatusTransitionPanel = ({
  report,
  onTransition,
  isLoading,
}: StatusTransitionPanelProps) => {
  const queryClient = useQueryClient();
  const allowed = getAllowedTransitions(report.status);
  const [selected, setSelected] = useState<(typeof allowed)[number] | null>(
    null,
  );
  const [form, setForm] = useState<TransitionForm>(EMPTY_FORM);
  const [amendOpen, setAmendOpen] = useState(false);
  const [amendReason, setAmendReason] = useState("");

  const closeAmendModal = () => {
    setAmendOpen(false);
    setAmendReason("");
  };

  const amendMutation = useMutation({
    mutationFn: (reason: string) => annualReportsApi.amend(report.id, reason),
    onSuccess: () => {
      toast.success("דוח נשלח לתיקון");
      queryClient.invalidateQueries({ queryKey: annualReportsQK.detail(report.id) });
      queryClient.invalidateQueries({ queryKey: annualReportsQK.all });
      closeAmendModal();
    },
    onError: (error) => showErrorToast(error, "שגיאה בשליחת תיקון"),
  });

  const [readinessOpen, setReadinessOpen] = useState(false);

  const setField =
    (field: keyof TransitionForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSelect = (status: (typeof allowed)[number]) => {
    setSelected((prev) => (prev === status ? null : status));
    setForm(EMPTY_FORM);
  };

  const handleAmendSubmit = () => {
    const trimmedReason = amendReason.trim();
    if (trimmedReason.length < 10) return;
    amendMutation.mutate(trimmedReason);
  };

  const handleSubmit = () => {
    if (!selected) return;
    onTransition({
      status: selected,
      note: form.note || null,
      ita_reference: form.itaRef || null,
      submission_method: form.submissionMethod || null,
      assessment_amount: form.assessmentAmount || null,
      refund_due: form.refundDue || null,
      tax_due: form.taxDue || null,
    });
    setSelected(null);
    setForm(EMPTY_FORM);
  };

  if (allowed.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
        אין מעברי סטטוס זמינים (הדוח {getStatusLabel(report.status)})
      </div>
    );
  }

  return (
    <>
      <AmendReportModal
        open={amendOpen}
        reason={amendReason}
        isPending={amendMutation.isPending}
        onReasonChange={setAmendReason}
        onClose={closeAmendModal}
        onSubmit={handleAmendSubmit}
      />

      <Card
        title="מעבר סטטוס"
        actions={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setReadinessOpen((p) => !p)}
            className="text-xs text-gray-500 hover:text-gray-700 px-1.5"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            בדיקת מוכנות להגשה
          </Button>
        }
      >
        <div className="space-y-4">
          {readinessOpen && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <ReadinessCheckPanel reportId={report.id} />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>סטטוס נוכחי:</span>
              <Badge variant={getStatusVariant(report.status)}>
                {getStatusLabel(report.status)}
              </Badge>
            </div>
            {report.status === "submitted" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmendOpen(true)}
              >
                תיקון דוח
              </Button>
            )}
          </div>

          <TransitionTargetSelector
            allowed={allowed}
            selected={selected}
            onSelect={handleSelect}
          />

          {selected && (
            <TransitionDetailsForm
              selected={selected}
              form={form}
              isLoading={isLoading}
              onFieldChange={setField}
              onCancel={() => setSelected(null)}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </Card>
    </>
  );
};
