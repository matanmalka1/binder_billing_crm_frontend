import { getStatusLabel } from "../../../../api/annualReport.extended.utils";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import type { TransitionDetailsFormProps } from "../../types";

export const TransitionDetailsForm = ({
  selected,
  form,
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
