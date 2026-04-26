import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { annualReportStatusApi, annualReportsQK } from "../../api";
import type { DeadlineType } from "../../api";
import { Button } from "../../../../components/ui/primitives/Button";
import { Input } from "../../../../components/ui/inputs/Input";
import { toast } from "../../../../utils/toast";
import { formatDate } from "../../../../utils/utils";
import { getDeadlineTypeLabel } from "@/features/taxDeadlines";

interface Props {
  reportId: number;
  deadlineType: DeadlineType;
  filingDeadline: string | null;
}

const DEADLINE_OPTIONS: { value: DeadlineType; label: string }[] = [
  { value: "standard", label: "סטנדרטי (29.05 ידני / 30.06 מקוון / 31.07 חברה)" },
  { value: "extended", label: "מורחב מייצגים — 31 ינואר" },
  { value: "custom", label: "מותאם אישית" },
];

export const DeadlineUpdatePanel: React.FC<Props> = ({
  reportId,
  deadlineType,
  filingDeadline,
}) => {
  const [selected, setSelected] = useState<DeadlineType>(deadlineType);
  const [customNote, setCustomNote] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      annualReportStatusApi.updateDeadline(reportId, {
        deadline_type: selected,
        ...(selected === "custom" && customNote ? { custom_deadline_note: customNote } : {}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: annualReportsQK.detail(reportId) });
      toast.success("מועד ההגשה עודכן בהצלחה");
    },
    onError: () => {
      toast.error("שגיאה בעדכון מועד ההגשה");
    },
  });

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-500">
        <span>מועד נוכחי: </span>
        <span className="font-medium text-gray-900">
          {getDeadlineTypeLabel(deadlineType)}
          {filingDeadline ? ` (${formatDate(filingDeadline)})` : ""}
        </span>
      </div>

      <fieldset className="space-y-2">
        {DEADLINE_OPTIONS.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="deadline_type"
              value={opt.value}
              checked={selected === opt.value}
              onChange={() => setSelected(opt.value)}
              className="accent-blue-600"
            />
            <span className="text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </fieldset>

      {selected === "custom" && (
        <Input
          type="text"
          value={customNote}
          onChange={(e) => setCustomNote(e.target.value)}
          placeholder="הערת מועד מותאם אישית"
          dir="rtl"
        />
      )}

      <Button
        type="button"
        size="sm"
        onClick={() => mutate()}
        isLoading={isPending}
        disabled={isPending}
      >
        שמור
      </Button>
    </div>
  );
};
