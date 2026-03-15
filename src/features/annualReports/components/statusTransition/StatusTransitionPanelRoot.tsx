import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { annualReportsApi } from "../../../../api/annualReport.api";
import { annualReportTaxApi } from "../../../../api/annualReport.tax.api";
import {
  getAllowedTransitions,
  getStatusLabel,
  getStatusVariant,
} from "../../../../api/annualReport.extended.utils";
import { Badge } from "../../../../components/ui/Badge";
import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";
import { QK } from "../../../../lib/queryKeys";
import { toast } from "../../../../utils/toast";
import { showErrorToast } from "../../../../utils/utils";
import { EMPTY_FORM } from "../../utils";
import type { StatusTransitionPanelProps, TransitionForm } from "../../types";
import { AmendReportModal } from "./AmendReportModal";
import { TransitionDetailsForm } from "./TransitionDetailsForm";
import { TransitionTargetSelector } from "./TransitionTargetSelector";

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
      queryClient.invalidateQueries({ queryKey: QK.tax.annualReports.detail(report.id) });
      queryClient.invalidateQueries({ queryKey: QK.tax.annualReports.kanban });
      queryClient.invalidateQueries({ queryKey: QK.tax.annualReports.all });
      closeAmendModal();
    },
    onError: (error) => showErrorToast(error, "שגיאה בשליחת תיקון"),
  });

  const canSubmit = allowed.includes("submitted");
  const { data: readiness } = useQuery({
    queryKey: QK.tax.annualReportReadiness(report.id),
    queryFn: () => annualReportTaxApi.getReadiness(report.id),
    enabled: canSubmit,
  });

  const setField =
    (field: keyof TransitionForm) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
      assessment_amount: form.assessmentAmount
        ? Number(form.assessmentAmount)
        : null,
      refund_due: form.refundDue ? Number(form.refundDue) : null,
      tax_due: form.taxDue ? Number(form.taxDue) : null,
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

      <Card title="מעבר סטטוס">
        <div className="space-y-4">
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
              readiness={readiness}
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
