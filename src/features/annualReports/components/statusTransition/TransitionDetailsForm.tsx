import { AlertTriangle } from "lucide-react";
import { getStatusLabel } from "../../../../api/annualReports.extended.utils";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import type { TransitionDetailsFormProps } from "../../types";

export const TransitionDetailsForm = ({
  selected,
  form,
  readiness,
  isLoading,
  onFieldChange,
  onCancel,
  onSubmit,
}: TransitionDetailsFormProps) => {
  return (
    <div className="animate-fade-in space-y-3 rounded-lg border border-primary-100 bg-primary-50/30 p-4">
      <Input
        label="הערה (אופציונלי)"
        value={form.note}
        onChange={onFieldChange("note")}
        placeholder="הערה על המעבר..."
      />

      {selected === "submitted" && readiness && !readiness.is_ready && (
        <div className="space-y-1 rounded-md border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-center gap-1.5 text-sm font-medium text-amber-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>הדוח אינו מוכן להגשה — הגשה תיחסם על ידי השרת</span>
          </div>
          <ul className="list-disc space-y-0.5 pr-5 text-xs text-amber-700">
            {readiness.issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {selected === "submitted" && (
        <Input
          label="מספר אסמכתא (ITA)"
          value={form.itaRef}
          onChange={onFieldChange("itaRef")}
          placeholder="מספר אסמכתא ממס הכנסה"
        />
      )}

      {selected === "assessment_issued" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Input
            label="סכום שומה (₪)"
            type="number"
            value={form.assessmentAmount}
            onChange={onFieldChange("assessmentAmount")}
          />
          <Input
            label="החזר מס (₪)"
            type="number"
            value={form.refundDue}
            onChange={onFieldChange("refundDue")}
          />
          <Input
            label="תשלום נוסף (₪)"
            type="number"
            value={form.taxDue}
            onChange={onFieldChange("taxDue")}
          />
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          ביטול
        </Button>
        <Button type="button" variant="primary" size="sm" onClick={onSubmit} isLoading={isLoading}>
          אישור מעבר ל{getStatusLabel(selected)}
        </Button>
      </div>
    </div>
  );
};
